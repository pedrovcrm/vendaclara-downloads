/* VendaClara: cálculo de quanto sobra de uma venda.
   Arquivo único usado pela calculadora do site e pela extensão do Chrome (copiado para extensao-chrome/ por
   scripts/montar_extensao.py). Mesma lógica de vendaclara/lucro.py (preco_minimo): custos em reais divididos
   por 1 menos a soma dos percentuais. Não altere a fórmula só em um dos lugares. */
(function (raiz) {
  "use strict";

  function n(v) { v = Number(v); return isFinite(v) ? v : 0; }

  /* Entrada: valores em reais (preco, custo, fixa, frete, outros) e em % (tarifa, imposto, ads, meta, tarifa2).
     meta e tarifa2 são opcionais (null/undefined = não calcular). */
  function calcular(e) {
    var p = n(e.preco), c = n(e.custo), t = n(e.tarifa) / 100, f = n(e.fixa), fr = n(e.frete),
        im = n(e.imposto) / 100, o = n(e.outros), a = n(e.ads) / 100;
    var tarifaValor = p * t + f, impostoValor = p * im, outrosValor = o + p * a;
    var sobra = p - tarifaValor - fr - impostoValor - c - outrosValor;
    var absolutos = c + f + fr + o, den = 1 - t - im - a;
    var r = {
      preco: p, tarifaValor: tarifaValor, frete: fr, impostoValor: impostoValor, custo: c, outrosValor: outrosValor,
      sobra: sobra, margem: p > 0 ? sobra / p : null,
      minimo: den > 0 ? absolutos / den : null,
      precoMeta: null, sobraTarifa2: null
    };
    if (e.meta !== null && e.meta !== undefined && e.meta !== "") {
      var dm = den - n(e.meta) / 100;
      r.precoMeta = dm > 0 ? absolutos / dm : null;
    }
    if (e.tarifa2 !== null && e.tarifa2 !== undefined && e.tarifa2 !== "") {
      r.sobraTarifa2 = p - (p * n(e.tarifa2) / 100 + f) - fr - impostoValor - c - outrosValor;
    }
    return r;
  }

  /* "1.234,56", "1234.56", "R$ 99,90" -> número */
  function numero(texto) {
    var v = String(texto == null ? "" : texto).trim().replace(/[R$\s]/g, "");
    if (v.indexOf(",") >= 0) v = v.replace(/\./g, "").replace(",", ".");
    var x = parseFloat(v);
    return isFinite(x) ? x : 0;
  }

  function brl(v) {
    return (v < 0 ? "− " : "") + "R$ " + Math.abs(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function pct(v) { return v.toFixed(1).replace(".", ",") + "%"; }

  var api = { calcular: calcular, numero: numero, brl: brl, pct: pct };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  raiz.VendaClaraCalculo = api;
})(typeof window !== "undefined" ? window : globalThis);
