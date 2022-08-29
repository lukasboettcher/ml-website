import { Component } from '@angular/core';

@Component({
  selector: 'app-notebooks',
  templateUrl: './notebooks.component.html',
  styleUrls: ['./notebooks.component.css']
})
export class NotebooksComponent {

  repoLink = 'lukasboettcher/ml-website-notebooks';

  notebookDesc: NotebookDescription[] = [];

  webRequest = false;

  constructor() {
    if (this.webRequest) {
      fetch(`https://api.github.com/repos/${this.repoLink}/contents`)
        .then(response => response.json())
        .then(json => {
          const re = /(?:\.([^.]+))?$/;

          const notebooks = json.map(obj => obj.name).filter(fileName => re.exec(fileName)[1] === 'ipynb');

          for (const nbName of notebooks) {
            fetch(`https://raw.githubusercontent.com/${this.repoLink}/main/${nbName}`)
              .then(responseNB => responseNB.json())
              .then(jsonNB => {
                const description = jsonNB.cells.filter(cell => cell.cell_type === 'markdown')[0].source; // [0].source

                const ndsc: NotebookDescription = {
                  fileName: nbName,
                  title: description[0],
                  description: description[2]
                };

                this.notebookDesc.push(ndsc);
              });
          }
        });
    }
  }

  // convert markdown string to html
  markdown(src) {
    const rxLt = /</g;
    const rxGt = />/g;
    const rxSpace = /\t|\r|\uf8ff/g;
    const rxEscape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
    const rxHr = /^([*\-=_] *){3,}$/gm;
    const rxBlockquote = /\n *&gt; *([^]*?)(?=(\n|$){2})/g;
    const rxList = /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g;
    const rxListjoin = /<\/(ol|ul)>\n\n<\1>/g;
    const rxHighlight = /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
    const rxCode = /\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g;
    const rxLink = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
    const rxTable = /\n(( *\|.*?\| *\n)+)/g;
    const rxThead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
    const rxRow = /.*\n/g;
    const rxCell = /\||(.*?[^\\])\|/g;
    const rxHeading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
    const rxPara = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
    const rxStash = /-\d+\uf8ff/g;

    const replace = (rex, fn) => {
      src = src.replace(rex, fn);
    };

    const element = (tag, content) =>
      '<' + tag + '>' + content + '</' + tag + '>';


    const blockquote = (_src) =>
      _src.replace(rxBlockquote, (all, content) =>
        element('blockquote', blockquote(highlight(content.replace(/^ *&gt; */gm, ''))))
      );


    const list = (_src) =>
      _src.replace(rxList, (all, ind, ol, num, low, content) => {
        const entry = element('li', highlight(content.split(
          RegExp('\n ?' + ind + '(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +', 'g')).map(list).join('</li><li>')));

        return '\n' + (ol
          ? '<ol start="' + (num
            ? ol + '">'
            : parseInt(ol, 36) - 9 + '" style="list-style-type:' + (low ? 'low' : 'upp') + 'er-alpha">') + entry + '</ol>'
          : element('ul', entry));
      });


    const highlight = (_src) =>
      _src.replace(rxHighlight, (all, _, p1, emp, sub, sup, small, big, p2, content) =>
        _ + element(
          emp ? (p2 ? 'strong' : 'em')
            : sub ? (p2 ? 's' : 'sub')
              : sup ? 'sup'
                : small ? 'small'
                  : big ? 'big'
                    : 'code',
          highlight(content))
      );


    const unesc = (str) =>
      str.replace(rxEscape, '$1');

    const stash = [];
    let si = 0;

    src = '\n' + src + '\n';

    replace(rxLt, '&lt;');
    replace(rxGt, '&gt;');
    replace(rxSpace, '  ');

    // blockquote
    src = blockquote(src);

    // horizontal rule
    replace(rxHr, '<hr/>');

    // list
    src = list(src);
    replace(rxListjoin, '');

    // code
    replace(rxCode, (all, p1, p2, p3, p4) => {
      stash[--si] = element('pre', element('code', p3 || p4.replace(/^    /gm, '')));
      return si + '\uf8ff';
    });

    // link or image
    replace(rxLink, (all, p1, p2, p3, p4, p5, p6) => {
      stash[--si] = p4
        ? p2
          ? '<img src="' + p4 + '" alt="' + p3 + '"/>'
          : '<a href="' + p4 + '">' + unesc(highlight(p3)) + '</a>'
        : p6;
      return si + '\uf8ff';
    });

    // table
    replace(rxTable, (all, table) => {
      const sep = table.match(rxThead)[1];
      return '\n' + element('table',
        table.replace(rxRow, (row, ri) =>
          row === sep ? '' : element('tr', row.replace(rxCell, (_, cell, ci) =>
            ci ? element(sep && !ri ? 'th' : 'td', unesc(highlight(cell || ''))) : ''))
        )
      );
    });

    // heading
    replace(rxHeading, (all, _, p1, p2) => _ + element('h' + p1.length, unesc(highlight(p2))));

    // paragraph
    replace(rxPara, (all, content) => element('p', unesc(highlight(content))));

    // stash
    replace(rxStash, (all) => stash[parseInt(all, 10)]);

    return src.trim();
  };

}

interface NotebookDescription {
  fileName: string;
  title: string;
  description?: string;
}
