import React from 'react';

const Arrow = () => (
  <span dangerouslySetInnerHTML={{
    __html: `
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 200.423 200.423" style="enable-background:new 0 0 200.423 200.423; width: 70px; height: 50px;" xml:space="preserve">
        <g>
          <polygon style="fill:#010002;" points="7.913,102.282 192.51,102.282 160.687,134.094 163.614,137.018 200.423,100.213 
            163.614,63.405 160.687,66.325 192.51,98.145 7.913,98.145 39.725,66.332 36.798,63.405 0,100.213 36.798,137.018 39.725,134.101  
            "/>
        </g>
      </svg>`,
  }}
  />
);

export default Arrow;
