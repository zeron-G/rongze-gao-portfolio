// Original block-letter construction: vector artwork, not embedded font files.
const glyphs={
 R:'M0 0H62Q92 0 92 30V77Q92 98 70 104L98 180H64L39 108H31V180H0ZM31 29V80H55Q61 80 61 72V37Q61 29 54 29Z',
 O:'M32 0H61Q93 0 93 33V147Q93 180 61 180H32Q0 180 0 147V33Q0 0 32 0ZM35 30Q30 30 30 37V143Q30 150 36 150H57Q63 150 63 143V37Q63 30 57 30Z',
 N:'M0 180V0H33L65 101V0H96V180H63L31 79V180Z',
 G:'M34 0H65Q96 0 96 34V54H65V38Q65 30 58 30H38Q31 30 31 38V142Q31 150 38 150H62V115H48V86H94V180H34Q0 180 0 146V34Q0 0 34 0Z',
 Z:'M0 0H94V28L33 150H94V180H0V151L61 30H0Z',
 E:'M0 0H88V30H31V73H78V103H31V150H88V180H0Z',
 A:'M0 180 31 0H67L100 180H68L63 145H36L31 180ZM40 118H59L49 44Z'
};
export function wordArt(text,cls=''){const width=text.split('').reduce((s,ch)=>s+(ch===' '?36:108),0)-8;let x=0;const letters=text.split('').map((ch,i)=>{const at=x;x+=ch===' '?36:108;return glyphs[ch]?`<g class="name-glyph" data-letter="${i}" style="--glyph:${i}" transform="translate(${at} 0)"><path d="${glyphs[ch]}" fill-rule="evenodd"/></g>`:'';}).join('');return `<svg class="name-art ${cls}" viewBox="0 0 ${width} 180" aria-hidden="true">${letters}</svg>`;}
export const mark=`<svg viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="M5 35V7h14q14 0 14 10 0 9-14 9h-3m4 0 13 9" stroke="currentColor" stroke-width="5"/><path d="m32 3 3 9 6 2-6 2-3 8-2-8-6-2 6-2Z" fill="currentColor"/></svg>`;
export function interestArt(id){
 if(id==='sky')return `<svg viewBox="0 0 290 330" aria-hidden="true"><g fill="none" stroke="currentColor" opacity=".65"><circle cx="145" cy="155" r="97"/><circle cx="145" cy="155" r="65"/><path d="M31 155h228M145 41v228M56 221l185-134" stroke-dasharray="2 5"/></g><path d="m150 53 10 68 64 32v9l-65-14-3 65 18 12v6l-27-10-27 10v-6l18-12-3-65-65 14v-9l64-32 9-68Z" fill="currentColor"/><text x="24" y="300" font-family="monospace" font-size="9">A DIFFERENT PERSPECTIVE.</text></svg>`;
 if(id==='mind')return `<svg viewBox="0 0 290 330" aria-hidden="true"><g fill="none" stroke="currentColor">${Array.from({length:18},(_,i)=>`<ellipse cx="145" cy="153" rx="${27+i*4}" ry="${86-i*2}" transform="rotate(${i*10} 145 153)" opacity=".7"/>`).join('')}</g><circle cx="145" cy="153" r="9" fill="currentColor"/><text x="24" y="300" font-family="monospace" font-size="9">FOLLOW THE QUESTION.</text></svg>`;
 if(id==='play')return `<svg viewBox="0 0 290 330" aria-hidden="true"><rect x="44" y="70" width="202" height="157" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="57" y="83" width="176" height="127" fill="currentColor" opacity=".13"/><path d="M90 270h110m-85-43v43m58-43v43" stroke="currentColor" stroke-width="4"/><g fill="currentColor">${[[93,105],[118,105],[118,130],[143,130],[143,155],[168,155],[168,180],[93,180],[68,180],[68,155],[193,105]].map(([x,y])=>`<rect x="${x}" y="${y}" width="20" height="20"/>`).join('')}</g><text x="24" y="300" font-family="monospace" font-size="9">NOT EVERYTHING NEEDS A PURPOSE.</text></svg>`;
 return `<svg viewBox="0 0 290 330" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M44 254h202M58 245V81h180v164M76 96h142v46H76Z"/><circle cx="146" cy="204" r="20"/><path d="M146 183v-24m0 65v19m-20-39h-20m60 0h20M90 104v28m12-28v28m12-28v28m12-28v28m12-28v28m12-28v28m12-28v28m12-28v28"/></g><text x="24" y="300" font-family="monospace" font-size="9">MAKE IT WORK IN THE REAL WORLD.</text></svg>`;
}
