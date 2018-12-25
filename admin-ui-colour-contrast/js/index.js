// slightly adapted from https://github.com/Qambar/color-contrast-checker/blob/master/src/colorContrastChecker.js

"use strict";

var ColorContrastChecker = function() {};

ColorContrastChecker.prototype = {
  fontSize: 14,
  rgbClass: {
    toString: function() {
      return '<r: ' + this.r +
        ' g: ' + this.g +
        ' b: ' + this.b +
        ' >';
    }
  },
  isValidColorCode: function(hex) {
    var regColorcode = /^(#)?([0-9a-fA-F]{6})([0-9a-fA-F]{6})?$/;
    return regColorcode.test(hex);
  },
  check: function(colorA, colorB, fontSize) {

    if (typeof fontSize !== 'undefined') {
      this.fontSize = fontSize;
    }

    if (!colorA || !colorB)
      return false;

    var color1, color2;
    var l1; /* higher value */
    var l2; /* lower value */

    if (!this.isValidColorCode(colorA)) {
      throw new Error("Invalid Color :" + colorA);
    }

    if (!this.isValidColorCode(colorB)) {
      throw new Error("Invalid Color :" + colorB);
    }

    color1 = this.getRGBFromHex(colorA);
    color2 = this.getRGBFromHex(colorB);

    var l1RGB = this.calculateLRGB(color1);
    var l2RGB = this.calculateLRGB(color2);

    /* where L is luminosity and is defined as */
    l1 = this.calculateLuminance(l1RGB);
    l2 = this.calculateLuminance(l2RGB);

    return this.verifyContrastRatio(this.getContrastRatio(l1, l2));
  },
  checkPairs: function(pairs) {
    var results = [];

    for (var i in pairs) {
      var pair = pairs[i];
      if (typeof pair.fontSize !== 'undefined') {
        results.push(
          this.check(
            pair.colorA,
            pair.colorB,
            pair.fontSize
          )
        );
      } else {
        results.push(
          this.check(
            pair.colorA,
            pair.colorB
          )
        );
      }
    }
    return results;
  },
  calculateLuminance: function(lRGB) {
    return (0.2126 * lRGB.r) + (0.7152 * lRGB.g) + (0.0722 * lRGB.b);
  },
  isLevelAA: function(colorA, colorB, fontSize) {
    var result = this.check(colorA, colorB, fontSize);
    return result.WCAG_AA;
  },
  isLevelAAA: function(colorA, colorB, fontSize) {
    var result = this.check(colorA, colorB, fontSize);
    return result.WCAG_AAA;
  },
  getRGBFromHex: function(color) {

    var rgb = Object.create(this.rgbClass),
      rVal,
      gVal,
      bVal;

    if (typeof color !== 'string') {
      throw new Error('must use string');
    }

    rVal = parseInt(color.slice(1, 3), 16);
    gVal = parseInt(color.slice(3, 5), 16);
    bVal = parseInt(color.slice(5, 7), 16);

    rgb.r = rVal;
    rgb.g = gVal;
    rgb.b = bVal;

    return rgb;
  },
  calculateSRGB: function(rgb) {
    var sRGB = Object.create(this.rgbClass),
      key;

    for (key in rgb) {
      if (rgb.hasOwnProperty(key)) {
        sRGB[key] = parseFloat((rgb[key] / 255), 10);
      }
    }

    return sRGB;
  },
  calculateLRGB: function(rgb) {
    var sRGB = this.calculateSRGB(rgb);
    var lRGB = Object.create(this.rgbClass),
      key,
      val = 0;

    for (key in sRGB) {
      if (sRGB.hasOwnProperty(key)) {
        val = parseFloat(sRGB[key], 10);
        if (val <= 0.03928) {
          lRGB[key] = (val / 12.92);
        } else {
          lRGB[key] = Math.pow(((val + 0.055) / 1.055), 2.4);
        }
      }
    }

    return lRGB;
  },
  getContrastRatio: function(lumA, lumB) {
    var ratio,
      lighter,
      darker;

    if (lumA >= lumB) {
      lighter = lumA;
      darker = lumB;
    } else {
      lighter = lumB;
      darker = lumA;
    }

    ratio = (lighter + 0.05) / (darker + 0.05);

    return ratio;
  },
  verifyContrastRatio: function(ratio) {

    var resultsClass = {
      toString: function() {
        return '< WCAG-AA: ' + ((this.WCAG_AA) ? 'pass' : 'fail') +
          ' WCAG-AAA: ' + ((this.WCAG_AAA) ? 'pass' : 'fail') +
          ' >';
      }
    };
    var WCAG_REQ_RATIO_AA_LG = 3.0,
      WCAG_REQ_RATIO_AA_SM = 4.5,
      WCAG_REQ_RATIO_AAA_LG = 4.5,
      WCAG_REQ_RATIO_AAA_SM = 7.0,
      WCAG_FONT_CUTOFF = 18;

    var results = Object.create(resultsClass),
      fontSize = this.fontSize || 14;

    results.ratio = ratio.toFixed(2);
    if (fontSize >= WCAG_FONT_CUTOFF) {
      results.WCAG_AA = (ratio >= WCAG_REQ_RATIO_AA_LG);
      results.WCAG_AAA = (ratio >= WCAG_REQ_RATIO_AAA_LG);
    } else {
      results.WCAG_AA = (ratio >= WCAG_REQ_RATIO_AA_SM);
      results.WCAG_AAA = (ratio >= WCAG_REQ_RATIO_AAA_SM);
    }

    return results;
  }

};

var nest = function(obj, keys, v) {
    if (keys.length === 1) {
      obj[keys[0]] = v;
    } else {
      var key = keys.shift();
      obj[key] = nest(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
    }

    return obj;
};

var objectResults = {};
var objectBackgrounds = {}

$.getJSON("/admin-ui-colour-contrast/js/colors.json", function(data){
    var backgrounds = data.backgrounds;
    var textColor = data.TextColor;
    var i, j, div, div2, ccc = new ColorContrastChecker, results, text = [];

    for (i in backgrounds) {
      div = document.createElement('div')
      //div.style.background = backgrounds[i];
      var backgroundName = i;
      var objectData = [];

      //objectData.push([]);
      for (j in textColor) {
        var subObject = {};
        var newLine = document.createElement('br');
        div.style.color = textColor[j];
        results = ccc.check(backgrounds[i], textColor[j], '13px');
        text = [
          j + " ON " + i,
          "Contrast: " + results['ratio'],
          "WCAG AA: " + results['WCAG_AA'],
          "WCAG AAA: " + results['WCAG_AAA']
        ];
        //var name = j + " ON " + i;
        subObject.name = j + " ON " + i;
        subObject.ratio = results.ratio;
        subObject.WCAG_AA = results.WCAG_AA;
        subObject.WCAG_AAA = results.WCAG_AAA;

        div.innerHTML += text.join(' ');
        div.appendChild(newLine);
        if (results['WCAG_AA']) {
          document.body.appendChild(div);
        }
        div.appendChild(newLine)
        objectData.push(subObject);

      }
      //console.log(objectData);
      objectBackgrounds[backgroundName] = Object.assign({}, objectData);
      objectResults.backgrounds = Object.assign({}, objectBackgrounds);
    }
  });

console.log(objectResults);
console.log(objectBackgrounds);


var arreglo = [];
var test1, test2, test3 = 1;

arreglo.push({
  test1: test1,
  test2: test2,
  test3: test3,
});

console.log(arreglo);


var arreglo2 = [];
var test1 = 20;
var test2 = 30;
var test3 = 40;

var nuevoobjeto = [];
var arreglocom = [];

nuevoobjeto.valor0 = test1;
nuevoobjeto.valor1 = test2;
nuevoobjeto.valor2 = test3;

console.log(nuevoobjeto);

for (var i = 0; i < 3; i++) {
  var tempvalue = "valor" + i;
  arreglo2.push({test: nuevoobjeto[tempvalue]});
}

for (var i = 0; i < 4; i++) {
  arreglocom.push({arreglo2});
}

//arreglo2.test = arreglo2.push(nuevoobjeto);
console.log(arreglo2);
console.log(arreglocom)
