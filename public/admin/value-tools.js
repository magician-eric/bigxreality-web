// Small JSON-schema subset used for Astro's number|string and object|string unions.
// Reject unsupported validation keywords rather than silently changing the stored type.
export function validateValue(value, schema, path = '$') {
  if (schema.anyOf) {
    if (!schema.anyOf.some(option => !validateValue(value, option, path))) return `${path}: 不符合允許的資料型別或欄位結構`;
    return '';
  }
  if (schema.enum && !schema.enum.includes(value)) return `${path}: 值不在允許清單`;
  if (schema.const !== undefined && value !== schema.const) return `${path}: 值必須為 ${schema.const}`;
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return `${path}: 必須為物件`;
    for (const key of schema.required ?? []) if (value[key] === undefined) return `${path}.${key}: 必填`;
    for (const [key, item] of Object.entries(value)) {
      const rule = schema.properties?.[key] ?? schema.additionalProperties;
      if (rule === false) return `${path}.${key}: 未定義的欄位`;
      if (rule && typeof rule === 'object') { const error = validateValue(item, rule, `${path}.${key}`); if (error) return error; }
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) return `${path}: 必須為陣列`;
    for (let index=0; index<value.length; index++) { const error=validateValue(value[index], schema.items ?? {}, `${path}[${index}]`); if (error) return error; }
  } else if (schema.type === 'number' || schema.type === 'integer') {
    if (typeof value !== 'number' || !Number.isFinite(value) || (schema.type === 'integer' && !Number.isInteger(value))) return `${path}: 必須為${schema.type === 'integer' ? '整數' : '數字'}`;
    if (schema.minimum !== undefined && value < schema.minimum || schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) return `${path}: 數字太小`;
    if (schema.maximum !== undefined && value > schema.maximum) return `${path}: 數字太大`;
  } else if (schema.type === 'string') {
    if (typeof value !== 'string') return `${path}: 必須為字串`;
    if (schema.minLength !== undefined && value.length < schema.minLength) return `${path}: 文字過短`;
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) return `${path}: 文字格式不符`;
  } else if (schema.type === 'boolean' && typeof value !== 'boolean') return `${path}: 必須為布林值`;
  else if (schema.type === 'null' && value !== null) return `${path}: 必須為 null`;
  return '';
}
export const mediaFormat = {
  fromFile: text => ({ body: JSON.parse(text) }),
  toFile: ({ body }) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('媒體對應表必須為 JSON 物件');
    const error=validateValue(body,mediaSchema); if(error) throw new Error(error);
    return JSON.stringify(body, null, 2) + '\n';
  },
};

const localized = { type:'object', properties:{tw:{type:'string'},en:{type:'string'},jp:{type:'string'}}, additionalProperties:false };
const photo = { type:'object', required:['filename','approved'], properties:{filename:{type:'string',pattern:'^[a-z0-9-]+\\.(jpg|jpeg|png)$'},approved:{type:'boolean'},alt:localized,caption:localized},additionalProperties:false };
export const mediaSchema = {type:'object',additionalProperties:{type:'object',properties:{
  publicationDate:{anyOf:[{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},{type:'null'}]},
  cover:photo,gallery:{type:'array',items:photo},
  videos:{type:'array',items:{type:'object',required:['type','url'],properties:{type:{enum:['youtube','facebook','local']},url:{type:'string',pattern:'^(https://|/media/news/)'},embedApproved:{type:'boolean'},approved:{type:'boolean'},title:localized,poster:{type:'string'}},additionalProperties:false}},
  sourceLinks:{type:'array',items:{type:'string',pattern:'^https://'}},
},additionalProperties:false}};
