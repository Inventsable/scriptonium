export default (async function (code) {
  const babel = require("@babel/standalone");

  return await evalScript(compileDownToAdobe(code));

  /**
   * Compiles parameter code down to ECMA-262 standard (with exception of ES6 constructor extensions)
   *
   * This does not handle things like Array.map or Object.entries, but would not be a problem if you use the following:
   * https://github.com/battleaxedotco/gehenna
   *
   * @param {String} data - The string of code to compile down
   *
   * @returns {String} - The compiled output
   */
  function compileDownToAdobe(data = "") {
    if (!data.length) return data;
    return babel
      .transform(data, {
        presets: ["es2015"],
        plugins: [
          // https://babeljs.io/docs/en/plugins
          "transform-template-literals",
          "transform-block-scoping",
          "transform-arrow-functions",
          "transform-spread",
        ],
      })
      .code.replace("const", "var")
      .replace("let", "var");
  }

  /**
   *  Taken from cluecumber:
   *
   *  Promisified wrapper around CSInterface.evalScript
   *  Returns a promise/thenable object which is pre-parsed if JSON
   *  If not in a CEP panel (and in browser/panelify, return second param as result)
   *
   * @param {String} text - The text to eval
   * @param {any} defs - Return value in the instance of being used in browser
   *
   * @returns {any} - The returned value of the evalScript string invocation
   */
  async function evalScript(text, defs = {}) {
    if (window.__adobe_cep__) {
      let CS_Interface = new CSInterface();
      return new Promise((resolve, reject) => {
        CS_Interface.evalScript(`${text}`, (res) => {
          if (res) resolve(isJson(res) ? JSON.parse(res) : res);
          else if (res.length) reject({ error: res });
        });
      });
    } else return defs;
  }

  /**
   * This is used to pre-parse data if returned within evalScript via JSON.stringify()
   *
   * @param {Any} str - The object/string to check
   *
   * @returns {Boolean} - Whether result is JSON
   */
  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
})();
