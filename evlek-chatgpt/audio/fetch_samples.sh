#!/usr/bin/env bash
# CC0 örnekleri sabit commit'lerden indirir → audio/_samples/ (git dışı). Lisans ve kaynak: audio/SAMPLES.md
# Kullanım: bash audio/fetch_samples.sh
set -euo pipefail
D="${SFX_DIR:-$(cd "$(dirname "$0")" && pwd)/_samples}"; mkdir -p "$D"
get() { # repo commit dizin [yol-deseni]
  local url=$1 sha=$2 dir=$3 pat=${4:-}
  if [ -d "$D/$dir/.git" ] && [ "$(git -C "$D/$dir" rev-parse HEAD)" = "$sha" ]; then echo "var: $dir"; else
    rm -rf "${D:?}/$dir"; git init -q "$D/$dir"; git -C "$D/$dir" remote add origin "$url"
    git -C "$D/$dir" config gc.auto 0
    git -C "$D/$dir" fetch -q --depth 1 --filter=blob:none origin "$sha"
    git -C "$D/$dir" -c advice.detachedHead=false checkout -q --no-progress FETCH_HEAD -- LICENSE* 2>/dev/null || true
    git -C "$D/$dir" update-ref HEAD "$sha"
  fi
  if [ -n "$pat" ]; then
    git -C "$D/$dir" ls-tree -r --name-only HEAD | grep -E "$pat" | tr '\n' '\0' | xargs -0 git -C "$D/$dir" checkout -q HEAD --
  else git -C "$D/$dir" checkout -q HEAD -- .; fi
}
get https://github.com/Calinou/kenney-interface-sounds.git 4596a49eaf5a533948d49a47467f606bcdea70ff kenney-interface-sounds
get https://github.com/Calinou/kenney-ui-audio.git        8c3d81b9159d058c444f89d12d518276b0b09345 kenney-ui-audio
get https://github.com/sgossner/VCSL.git                  c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e vcsl \
  '^LICENSE$|Steinway B/NoSus/JHPiano_NoSus_Close_[A-G]#?[1-6]_vl[23]_rr1|Vibraphone/Soft Mallets|Glockenspiel/glock_(soft|medium)|Struck Idiophones/Claps/|Hi-Hat Cymbal/'
echo "tamam → $D"
