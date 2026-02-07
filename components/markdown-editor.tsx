'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import CryptoJS from 'crypto-js';
import config from '@/app-config.json';
import calcs from '@/calcs.json';
import RenderMarkDown from './markdown/MarkdownRenderer';
import { FormulaConstants } from '@/helpers/constants';

const encKey = config.encKey;
const content = calcs.content;

const initialValue = `

[Click Me](#custom-id-here)

<iframe width="320" height="280" style="border-radius:20px"  src="https://www.youtube.com/embed/xdiD0N2_-yc" title="YouTube video player" frameBorder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen>
</iframe>

# This is Sample Markdown
#### Delete this and start creating at your own.

The lift coefficient ($C^L$) is a dimensionless coefficient.

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

## Surprise {#custom-id-here}

A table:-
| Sites |  Owners | Location |
| ------------ | ----------- |-|
| Sanraj | Raj | Nawalgarh |
| Doubtlet | Neetesh | Alwar |

<a href = "mailto: raj@sanraaj.com">Send Email</a>
`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = (...args: any[]) => void;

const debounce = (func: Procedure, timeout = 3000) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<typeof func>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

const processChange = debounce((value: string) => {
  sessionStorage.setItem('code', value);
});

//TODO :1 Align both select buttons horizontally
//      2 Add Checkbox in option if the file is availabe in system
//      3 Seperate response message box for them
function MarkdownEditor() {
  const [markDown, setMarkDown] = useState(initialValue);
  const [note, setNote] = useState('all');
  const [formula, setFormula] = useState('all');
  const [notesRespMsg, setNotesRespMsg] = useState('');
  const [formulaRespMsg, setFormulaRespMsg] = useState('');
  const [cls, setClass] = useState('success');

  const formulaList = FormulaConstants.map((formula) => formula.label);
  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    processChange(inputValue);
    setMarkDown(inputValue);
  };

  useEffect(
    () => setMarkDown(sessionStorage.getItem('code') || initialValue),
    []
  );

  const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormulaRespMsg('');
    setNotesRespMsg('');
    setNote(event.target.value);
  };

  const onChangeFormula = (event: ChangeEvent<HTMLSelectElement>) => {
    setNotesRespMsg('');
    setFormulaRespMsg('');
    setFormula(event.target.value);
  };

  const addFormula = async () => {
    const data = await fetch(`/api/formulas?name=${formula}`).then((res) =>
      res.json()
    );
    if (data.success) {
      setClass('success');
    } else if (!data.success) {
      setClass('danger');
    }
    setFormulaRespMsg(data.message);
  };

  const addNote = async () => {
    const data = await fetch(`/api/notes?name=${note}`).then((res) =>
      res.json()
    );

    if (data.success) {
      setClass('success');
    } else if (!data.success) {
      setClass('danger');
    }
    setNotesRespMsg(data.message);
  };

  const encryptContent = () => {
    const encryptedContent = CryptoJS.AES.encrypt(markDown, encKey).toString();
    return encryptedContent;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const encryptedContent = encryptContent();
    const file = new Blob([encryptedContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'markdown.md';
    document.body.appendChild(element);
    element.click();
  };

  const handleCopy = () => {
    const content = encryptContent();
    navigator.clipboard.writeText(content);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const encryptedContent = e.target?.result || '';
      const decryptedContent = CryptoJS.AES.decrypt(
        encryptedContent as string,
        encKey
      ).toString(CryptoJS.enc.Utf8);
      setMarkDown(decryptedContent);
    };
    if (file) reader.readAsText(file);
    else setMarkDown('No File Chosen');
  };

  return (
    <>
      <div className="markdown-editor bg-transparent">
        <textarea
          className="markdown-editor__input card-body shadow markdown_common"
          value={markDown}
          onChange={handleInput}
          placeholder="Input"
        />

        <div className="markdown-editor__output card-body shadow markdown_common">
          <div className="export-actions d-flex justify-content-end">
            <i className="fas fa-download mb-3" onClick={handleDownload} />
            <i className="fas fa-copy mb-3 ms-2" onClick={handleCopy} />
          </div>
          <div className="markdown-editor__Inner">
            <RenderMarkDown>{markDown}</RenderMarkDown>
          </div>
        </div>
      </div>
      <div className="m-3 mt-5 justify-content-center ">
        <div className="input-group">
          <label
            className="input-group-text btn btn-primary"
            htmlFor="fileInput"
          >
            Choose File
          </label>
          <input
            type="file"
            className="form-control"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="row justify-content-center mb-2 mx-5">
        <div className="col-md-6 text-center">
          <div className="w-75 mx-auto">
            <h3 className="text-center">Update Calculator Notes</h3>
            <select
              className="form-select border-primary"
              aria-label="Default select example"
              onChange={onChangeSelect}
              value={note}
            >
              <option value={'all'}>All</option>
              {content.sort().map((calc) => (
                <option key={calc} value={calc}>
                  {calc}
                </option>
              ))}
            </select>
            <p className={`text-center text-${cls}`}>{notesRespMsg}</p>
            <div className="text-center mb-3">
              <button className="btn btn-primary" onClick={addNote}>
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="w-75 mx-auto">
            <h3 className="text-center">Update Formula Sheet</h3>
            <select
              className="form-select border-primary"
              aria-label="Default select example"
              onChange={onChangeFormula}
              value={formula}
            >
              <option value={'all'}>All</option>
              {formulaList.sort().map((formula) => (
                <option key={formula} value={formula}>
                  {formula}
                </option>
              ))}
            </select>
            <p className={`text-center text-${cls}`}>{formulaRespMsg}</p>
            <div className="text-center mb-3">
              <button className="btn btn-primary" onClick={addFormula}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
