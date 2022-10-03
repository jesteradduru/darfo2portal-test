import React from "react";
import { IconatedButton } from "../../Portal";
import { BsPrinter } from "react-icons/bs";
import * as htmlToImage from "html-to-image";
import './PrintStyles.css'
import { Container } from "reactstrap";

const PrintCanvasButton = ({ name, filename, elementId }) => {
  const printCanvas = () => {
    htmlToImage
      .toPng(document.getElementById(elementId))
      .then(function (dataUrl) {
        let html = "<html><head><title></title></head>";
        html += '<body style="width: 100%; padding: 0; margin: 0;"';
        html += ' onload="window.focus(); window.print(); window.close()">';
        html += '<img src="' + dataUrl + '" height="500" width="750"/></body></html>';

        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(html);
        pri.document.close();
      });
  };

  return (
    <>
      <iframe
        title="Print routing"
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
      <IconatedButton
        name={name}
        outline
        icon={<BsPrinter />}
        className="ms-auto d-block my-2 d-print-none"
        onClick={printCanvas}
      />
    </>
  );
};

export default PrintCanvasButton;
