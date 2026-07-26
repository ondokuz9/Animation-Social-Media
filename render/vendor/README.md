# Vendored CDN artifacts

`project/support.js` (the Claude Design runtime) loads React, ReactDOM and Babel
from unpkg and sets an `integrity` attribute on each script. `render/stage.mjs`
intercepts those three requests and fulfils them from this directory, so a render
makes **no network calls at all** — while subresource integrity still verifies,
because these are the byte-identical npm artifacts.

| request support.js makes | served from | sha384 (matches support.js SRI) |
|---|---|---|
| `react@18.3.1/umd/react.production.min.js` | `react-18.3.1/umd/react.production.min.js` | `DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z` |
| `react-dom@18.3.1/umd/react-dom.production.min.js` | `react-dom-18.3.1/umd/react-dom.production.min.js` | `gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1` |
| `@babel/standalone@7.29.0/babel.min.js` | `babel-standalone-7.29.0/babel.min.js` | `m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y` |

Verify at any time:

```sh
cd render/vendor
for f in react-18.3.1/umd/react.production.min.js \
         react-dom-18.3.1/umd/react-dom.production.min.js \
         babel-standalone-7.29.0/babel.min.js; do
  printf '%s  sha384-' "$f"; openssl dgst -sha384 -binary "$f" | openssl base64 -A; echo
done
```

## Restoring the full tarballs

Only the three files above (plus licences) are tracked in git — the unpacked
tarballs also contain dev builds and source maps, 48 MB that no render reads. To
recreate the full directories exactly as they were fetched:

```sh
cd render/vendor
npm pack react@18.3.1 react-dom@18.3.1 @babel/standalone@7.29.0
for f in *.tgz; do tar xzf "$f"; mv package "${f%.tgz}"; done
```

The versions are pinned deliberately: they are the versions `support.js` asks
for, and the SRI hashes above are what it checks against. **Do not upgrade them**
— a different React or Babel build fails integrity and the design will not mount.
