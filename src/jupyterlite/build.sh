#!/bin/sh
SCRIPT_DIR=$(dirname $0)
echo "removing previous jupyterlite root"
rm -r $SCRIPT_DIR/../jupyterlite-root
echo $SCRIPT_DIR
if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo "$SCRIPT_DIR/venv does not exist"
    python3 -m venv $SCRIPT_DIR/venv
fi
. $SCRIPT_DIR/venv/bin/activate
echo "installing packages into venv $(which pip)"
pip install -r $SCRIPT_DIR/requirements.txt
echo "building jupyterlite output"
jupyter lite build --no-sourcemaps --no-unused-shared-packages --lite-dir $SCRIPT_DIR --output-dir $SCRIPT_DIR/../jupyterlite-root --base-url 'ki-labor/jupyterlite-root/'
echo "done"
deactivate