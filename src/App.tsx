import React from "react";
import "./App.css";
import forge from "node-forge";
import { Formik } from "formik";

function App() {
  return (
    <div className="App">
      <Formik
        initialValues={{ PAN: "" }}
        onSubmit={(values) => {
          const encryptedPan = encryptPAN(values.PAN);
          decryptPan(encryptedPan);
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <legend>Enter your PAN</legend>
            <p>
              <input
                type="text"
                name="PAN"
                id="PAN"
                value={props.values.PAN}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
              />
              <label htmlFor="PAN">PAN</label>
              {props.errors.PAN && <div id="feedback">{props.errors.PAN}</div>}
            </p>
            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
    </div>
  );
}

const key = forge.random.getBytesSync(32);
const iv = forge.random.getBytesSync(32);

function encryptPAN(PAN: string) {
  // encrypt some bytes using CBC mode
  // (other modes include: ECB, CFB, OFB, CTR, and GCM)
  // Note: CBC and ECB modes use PKCS#7 padding as default
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(PAN));
  cipher.finish();
  const encrypted = cipher.output;

  // outputs encrypted hex
  console.log(encrypted.toHex());
  return encrypted;
}

function decryptPan(encryptedPAN: any) {
  // decrypt some bytes using CBC mode
  // (other modes include: CFB, OFB, CTR, and GCM)
  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(encryptedPAN);
  const result = decipher.finish(); // check 'result' for true/false
  console.log(result);
  // outputs decrypted hex
  console.log(decipher.output);
  console.log(decipher.output.toHex());
}

export default App;
