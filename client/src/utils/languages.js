import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { lezer } from "@codemirror/lang-lezer";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { less } from "@codemirror/lang-less";
import { sass } from "@codemirror/lang-sass";
import { clojure } from "@nextjournal/lang-clojure";
import { csharp } from "@replit/codemirror-lang-csharp";

// Language extensions map
export const languageExtensions = {
  c: cpp(),
  cpp: cpp(),
  html: html(),
  java: java(),
  javascript: javascript({ jsx: true }),
  json: json(),
  lezer: lezer(),
  markdown: markdown(),
  php: php(),
  python: python(),
  rust: rust(),
  sql: sql(),
  xml: xml(),
  less: less(),
  sass: sass(),
  clojure: clojure(),
  csharp: csharp(),
  other: javascript()
};

// Placeholders for each language
export const placeholders = {
  c: '#include <stdio.h>\n\nint main() {\n  printf("Hello World!");\n  return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello World!";\n  return 0;\n}',
  html: '<h1>Hello World!</h1>',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
  javascript: 'console.log("Hello World!");',
  json: '{\n  "message": "Hello World!"\n}',
  lezer: '// Lezer grammar here...',
  markdown: '# Hello World!',
  php: '<?php\n  echo "Hello World!";\n?>',
  python: 'print("Hello World!")',
  rust: 'fn main() {\n  println!("Hello World!");\n}',
  sql: 'SELECT \'Hello World!\' AS message;',
  xml: '<message>Hello World!</message>',
  less: '@color: #4D926F;\n#header {\n  color: @color;\n}',
  sass: '$font-stack: Helvetica, sans-serif;\n$primary-color: #333;\n\nbody {\n  font: 100% $font-stack;\n  color: $primary-color;\n}',
  clojure: '(println "Hello World!")',
  csharp: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello World!");\n  }\n}',
  other: '// Write your code here...'
};

// Languages list
export const languages = [
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'html', name: 'HTML' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'json', name: 'JSON' },
  { id: 'lezer', name: 'Lezer' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'php', name: 'PHP' },
  { id: 'python', name: 'Python' },
  { id: 'rust', name: 'Rust' },
  { id: 'sql', name: 'SQL' },
  { id: 'xml', name: 'XML' },
  { id: 'less', name: 'LESS' },
  { id: 'sass', name: 'SASS' },
  { id: 'clojure', name: 'Clojure' },
  { id: 'csharp', name: 'C#' },
  { id: 'other', name: 'Other'}
];
