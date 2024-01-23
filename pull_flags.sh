#!/usr/bin/env sh

cleanup() {
    echo "Download failed."
    rm -rf flags

    if [ -d "flags_tmp" ]; then
        mv flags_tmp flags
    fi

    exit 1
}

if [ -d "flags" ]; then
    mv flags flags_tmp
fi

trap cleanup INT

if (
    ./scripts/national.js && \
    ./scripts/dependency.js && \
    ./scripts/subdivision.js && \
    ./scripts/micronation.js && \
    ./scripts/proposed.js
); then
    flags=$(ls flags/*/*.json | wc -l)
    echo "Download Finished. Downloaded $flags flags."

    if [ -d "flags_tmp" ]; then
        rm -rf flags_tmp
    fi
else
    cleanup
fi
