chmod 755 scripts -R
find packages/ -name 'build' -exec chmod 755 {} \;
find packages/ -name 'unpack' -exec chmod 755 {} \;
find packages/ -name 'need_unpack' -exec chmod 755 {} \;
find packages/ -name 'need_build' -exec chmod 755 {} \;
find packages/ -name 'install' -exec chmod 755 {} \;
