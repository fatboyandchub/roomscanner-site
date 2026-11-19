#!/usr/bin/env python3
"""Stamp every /assets/... address in the pages with ?v=<hash of the file>, so a
changed picture, stylesheet or script is fetched fresh and an unchanged one is
cached for good. Also copies support.html and privacy.html to support/index.html
and privacy/index.html, so /support and /privacy work on any static host.

Run it from the site's folder before committing:  python3 tools/stamp.py
"""
import hashlib, os, re, shutil, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
pattern = re.compile(r'((?:src|href|poster|data-src|srcset)=")(/assets/[^"?#]+)(\?v=[0-9a-f]+)?(")')

def stamp(m):
    path = m.group(2).lstrip('/')
    if not os.path.isfile(path):
        print('  missing:', path, file=sys.stderr)
        return m.group(1) + m.group(2) + m.group(4)
    with open(path, 'rb') as f:
        v = hashlib.md5(f.read()).hexdigest()[:8]
    return m.group(1) + m.group(2) + '?v=' + v + m.group(4)

for name in sorted(os.listdir('.')):
    if not name.endswith('.html'):
        continue
    with open(name, encoding='utf-8') as f:
        before = f.read()
    after = pattern.sub(stamp, before)
    if after != before:
        with open(name, 'w', encoding='utf-8') as f:
            f.write(after)
    print('stamped', name)

for page in ('support', 'privacy'):
    os.makedirs(page, exist_ok=True)
    shutil.copyfile(page + '.html', os.path.join(page, 'index.html'))
    print('copied', page + '.html', '->', page + '/index.html')
