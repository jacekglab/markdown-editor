"use strict";

var input = document.getElementById("input");
var output = document.getElementById("output");

var editor = {
  simpleText: "#Weekly JavaScript Challenge #9\n##Stwórz prosty edytor markdown\n\nWymagania:\n* edycja tekstu w polu powoduje automatyczne renderowanie obok\n* obsługa **przynajmniej** podstawowych elementów języka markdown\n* tekst powinien się automatycznie zapisywać w przeglądarce\n* edytor powinien być funkcjonalny również na urządzeniach mobilnych\n\nTechnologia:\n* dowolna ze wskazaniem na czysty JS\n* dodatkowe utrudnienie: Spróbować zaimplementować obsługę Markdowna samemu bez gotowych bibliotek (nieobowiązkowo)\n\nZaimplementowano:\n* **pogrubienie**\n* _kursywa_\n* [odnośnik](http://typeofweb.com/)\n* #### Nagłówki\n* -podkreslenie-\n* listy",

  regex: {
    bold: /(\*\*([\s\S]*?)\*\*)/g,
    italic: /\_([\s\S]*?)\_/g,
    underline: /\-([\s\S]*?)\-/g,
    url: /\[([\s\S]*?)\]\(([\s\S]*?)\)/g,
    br: /\n/g,
    li: /\* ([\s\S]*?)(\n|$)/g,
    ul: /(<li>)(.*)(<\/li>)/g,
    paragraphs: /<p><\/p>/g
  },

  parse: function parse(str) {
    str = str.replace(this.regex.li, "<li>$1</li>");
    str = str.replace(this.regex.ul, "<ul><li>$2</ul>");
    str = this.createHeaders(str);
    str = str.replace(this.regex.bold, "<strong>$2</strong>");
    str = str.replace(this.regex.italic, "<em>$1</em>");
    str = str.replace(this.regex.underline, '<span style="text-decoration: underline;">$1</span>');
    str = str.replace(this.regex.url, "<a href='$2'>$1</a>");
    str = str.replace(this.regex.br, "<br>");
    str = this.createParagraphs(str);
    return str;
  },

  createParagraphs: function createParagraphs(str) {
    str = str.split(/<br><br>/g);
    var paragraphs = "";
    for (var i = 0; i < str.length; i++) {
      str[i] = "<p>" + str[i] + "</p>";
      paragraphs += str[i];
    }
    return paragraphs.replace(this.regex.paragraphs, "<br>");
  },

  createHeaders: function createHeaders(str) {
    for (var i = 6; i > 0; i--) {
      str = str.replace(new RegExp("#{" + i + "}(.*)(\n|(?=</li>))", "g"), "<h" + i + ">$1</h" + i + ">");
    }
    return str;
  },

  loadStorage: function loadStorage() {
    if (localStorage.getItem('storage') === null) {
      localStorage.setItem('storage', this.simpleText);
    }
    return localStorage.getItem('storage');
  },

  saveStorage: function saveStorage(str) {
    localStorage.setItem('storage', str);
  }
};

input.onkeyup = function () {
  output.innerHTML = editor.parse(input.value);
  editor.saveStorage(input.value);
};

input.value = editor.loadStorage();
output.innerHTML = editor.parse(input.value);