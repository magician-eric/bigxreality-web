# Item 6: compare built HTML of the product pages between two builds.
# Hashed asset names (/_astro/...) are normalised; everything else must match.
import re, sys, difflib, pathlib, json
a, b = map(pathlib.Path, sys.argv[1:3])
def norm(t):
    t = re.sub(r'/_astro/[^"\' ,)]+', '/_astro/*', t)
    t = re.sub(r'(src|href)="data:image/svg\+xml,[^"]*"', r'\1="data:svg"', t)
    return t
pages = sorted(p.relative_to(a) for p in a.rglob("*.html"))
report = {}
for rel in pages:
    pa, pb = a / rel, b / rel
    if not pb.exists(): report[str(rel)] = "MISSING in B"; continue
    ta, tb = norm(pa.read_text()), norm(pb.read_text())
    if ta == tb: report[str(rel)] = "identical"; continue
    # split into tags so the diff is readable
    sa, sb = re.split(r'(?=<)', ta), re.split(r'(?=<)', tb)
    d = [l for l in difflib.unified_diff(sa, sb, lineterm="", n=0) if not l.startswith(("---", "+++", "@@"))]
    report[str(rel)] = d[:40]
extra = sorted(str(p.relative_to(b)) for p in b.rglob("*.html") if not (a / p.relative_to(b)).exists())
print(json.dumps({"pages": report, "only_in_B": extra}, ensure_ascii=False, indent=1))
