const Router = (() => {

  function parse() {
    const raw = location.hash ? location.hash.slice(1) : '';
    let path = raw;
    let query = {};
    const qIdx = raw.indexOf('?');
    if (qIdx >= 0) {
      path = raw.slice(0, qIdx);
      const params = new URLSearchParams(raw.slice(qIdx + 1));
      params.forEach((value, key) => { query[key] = value; });
    }
    if (!path) path = '/';
    if (!path.startsWith('/')) path = '/' + path;
    return { path, query };
  }

  function run(render) {
    const dispatch = () => {
      const loc = parse();
      render(loc.path, loc.query);
      window.scrollTo(0, 0);
    };
    dispatch();
    window.addEventListener('hashchange', dispatch);
  }

  function navigate(hash) {
    location.hash = hash;
  }

  return { run, navigate };
})();