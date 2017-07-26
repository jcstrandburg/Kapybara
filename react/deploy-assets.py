#!/usr/bin/env python
import shutil

STATIC_DIR = '../application/static/'

assets = [
    ('index.js', STATIC_DIR+'index.js'),
    ('styles.css', STATIC_DIR+'styles.css'),
]

if __name__ == "__main__":
    for asset in assets:
        print(asset)
        shutil.copy(asset[0], asset[1])
    print("done")
