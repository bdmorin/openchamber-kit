(()=>{var S="openchamber.sdk",f=1;var St=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function Oo(e){let o=e.documentElement;if(o.hasAttribute("data-oc-scrollbar-activity"))return;o.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",(s)=>{let a=s.target===e?o:s.target;if(!(a instanceof Element))return;if(!a.hasAttribute("data-oc-scrolling"))a.setAttribute("data-oc-scrolling","");let u=r.get(a);if(u!==void 0)clearTimeout(u);r.set(a,setTimeout(()=>{r.delete(a),a.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Mn=`(${Oo.toString()})(document);`;var ft=128,ht=65536;var He=128;var $e=65536;var mt=8000,gt=192000,At=120000;var xo=(e)=>{let o=[],r=0,s=0;return{push:(a)=>{o.push(a),s+=a.length;while(s-r>e&&o.length>1){let u=o.shift();s-=u?.length??0,r=0}},pull:(a)=>{let u=0;while(u<a.length&&o.length>0){let h=o[0],m=Math.min(a.length-u,h.length-r);if(a.set(h.subarray(r,r+m),u),u+=m,r+=m,r>=h.length)o.shift(),s-=h.length,r=0}a.fill(0,u)},clear:()=>{o.length=0,r=0,s=0},get size(){return s-r}}};var Io=/^[a-z][a-z0-9-]{0,39}$/;var Ro=(e)=>Object(e)===e&&!Array.isArray(e),Ot=(e,o)=>Object.keys(e).every((r)=>o.includes(r)),bo=(e)=>String(e)===e&&e.length>=1&&e.length<=60,ko=(e)=>String(e)===e&&e.length>=1&&e.length<=80,vo=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let o=new Set;for(let r of e){if(!Ro(r)||!Io.test(r.id)||!bo(r.label))return!1;if(r.disabled!==void 0&&r.disabled!==!0&&r.disabled!==!1)return!1;if(o.has(r.id))return!1;if(o.add(r.id),r.kind==="button"){if(!Ot(r,["kind","id","label","disabled"]))return!1;continue}if(r.kind!=="select"||!Ot(r,["kind","id","label","value","options","disabled"]))return!1;if(!ko(r.value)||!Array.isArray(r.options)||r.options.length<1||r.options.length>16)return!1;let s=new Set;for(let a of r.options){if(!Ro(a)||!Ot(a,["value","label"])||!ko(a.value)||!bo(a.label)||s.has(a.value))return!1;s.add(a.value)}if(!s.has(r.value))return!1}return!0};var yo=["{id}","{segment}","{segments+}"];var br=new Set(yo);var Co=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Ir=new Set(Co);var Xe=20000000,Ve=256;var xt=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,Mo=(e,o)=>{if(e.path!==o.path||e.readOnly!==o.readOnly)return!1;if(e.encoding==="text"||o.encoding==="text")return e.encoding==="text"&&o.encoding==="text"&&e.content===o.content;if(e.bytes.byteLength!==o.bytes.byteLength)return!1;for(let r=0;r<e.bytes.byteLength;r+=1)if(e.bytes[r]!==o.bytes[r])return!1;return!0};var Uo=/^[A-Za-z0-9_-]{1,80}$/;var No=["left","right","top","bottom"];var wo=(e,o=0,r={remaining:16000})=>{if(--r.remaining<0||o>=32)return!1;if(e===null)return!0;let s=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let a of s)if(!wo(a,o+1,r))return!1;return!0},Rt=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((o)=>/^(0|[1-9]\d*)$/.test(o)&&Number(o)<e.length)&&e.every(Rt);if(Object(e)===e){let o=Object.getPrototypeOf(e);return(o===null||o===Object.prototype)&&Object.values(e).every(Rt)}return String(e)===e||Number.isFinite(e)},bt=(e)=>{try{if(String(e.id)!==e.id||!Uo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!No.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!wo(e.data)||!Rt(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var Lo=/^[0-9a-f]{7,64}$/i,Po=(e)=>Lo.test(e),kt=255,Do=(e,o,r)=>({openCommit:(s)=>Po(s)?e({channel:S,v:f,type:"open-commit",id:o(),payload:{sha:s}}):r("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:s})=>{let a=s.trim();if(!a||a.length>kt)return r(`Base must contain 1 to ${kt} characters.`);return e({channel:S,v:f,type:"open-walkthrough",id:o(),payload:{base:a}})}});var vt=2000;var Ho=["file","directory","other","missing"],yt=(e)=>Boolean(e&&"sessionId"in e),Ct=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var Fe=500,Be=32000,$o=16000,Xo=128,Vo=200,Fo=2000,Bo=16000,Ko=80,Wo=200,zo=16000;var jo=2000;var Mt=20000,Ke=1024,We=2000000;var ze=64000,je=8000,Ut=4000;var Nt=960000;var Jo=999,Yo=1e4,Ae=500,Qo=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],qo=["stopped","starting","ready","failed"],Nn=new Set(Qo),Zo=(e)=>Nn.has(e),en=(e)=>e&&Zo(e)?e:"HOST_REJECTED",le=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(le);if(Object(e)===e)return Object.values(e).every(le);return!1},tn=(e)=>le(e)&&JSON.stringify(e).length<=zo,Go=(e)=>e?.trim().slice(0,Wo)??"",de=(e)=>{let o=e.id.trim().slice(0,Xo),r=e.title.trim().slice(0,Vo),s=e.url.trim().slice(0,Fo),a=e.text?.trim().slice(0,Bo),u=e.author?.trim().slice(0,Ko),h=e.kind==="pull"?"pull":"issue",m={providerId:e.providerId.trim(),id:o,title:r||o,url:s,kind:h};if(a)m.text=a;if(u)m.author=u;if(h==="pull"){let b=Go(e.branches?.head),w=Go(e.branches?.base);if(b&&w)m.branches={head:b,base:w}}if(tn(e.data))m.data=e.data;return m},wt=(e)=>{let o=de(e);if(e.projectId)o.projectId=e.projectId;if(e.navigation)o.navigation=e.navigation;if(e.worktree)o.worktree=e.worktree;return o},Lt=(e)=>{let o={text:e.text.trim().slice(0,$o)};if(e.send)o.send=!0;return o},Pt=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(Jo,Math.max(0,Math.round(e)))},Dt=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(Yo,Math.max(0,Math.ceil(e)))};var pe=(e)=>e.length>0&&e.length<=Ke&&!e.includes("\x00")&&!e.includes("\\");var Je=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>jo)return!1;return!e.split("/").some((r)=>r==="."||r==="..")},wn=new Set(qo),Gt=(e)=>Boolean(e&&"status"in e&&wn.has(String(e.status))&&!("body"in e)),Ye=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Ht=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),$t=(e)=>Boolean(e&&"written"in e&&e.written===!0),Xt=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),Ln=new Set(Ho),Vt=(e)=>Boolean(e&&"kind"in e&&"size"in e&&Ln.has(String(e.kind))&&Number.isFinite(e.size)),Ft=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Pn=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),Dn=(e)=>Object(e)===e?e:null,It=(e)=>String(e)===e&&e.length>0,Gn=(e)=>{if(!It(e.id))return null;if(e.ok===!0){let o={channel:S,v:f,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)o.payload=e.payload;return o}if(e.ok===!1&&It(e.error))return{channel:S,v:f,type:"result",id:e.id,ok:!1,error:e.error,code:en(It(e.code)?e.code:void 0)};return null},Bt=(e)=>{let o=Dn(e);if(!o||o.channel!==S||o.v!==f)return null;if(o.type==="result")return Gn(o);if(!Pn.has(String(o.type))||Object(o.payload)!==o.payload)return null;return o};var on=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),Hn=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class p extends Error{code;constructor(e,o){super(o);this.name="HostRequestError",this.code=e}}var nn=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),Qe=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${Ke} characters without NUL or backslash.`)),qe=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},T=(e)=>(e.value+=1,`oc-${e.value}`),Kt=(e={})=>{let o=e.target??("window"in globalThis?window:null);if(!o)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??((t)=>t===o.parent),s=e.requestTimeoutMs??Mt,a=new Set,u=new Set,h=new Set,m=new Set,b=new Set,w=new Set,Z=new Set,Ce=new Set,Me=new Set,Ue=new Set,Ne=new Set,re=new Set,dt=[],Te=null,Se=null,we=new Set,Le=new Set,fe=null,he=null,pt=!1,se=new Map,ie=new Map,ae=new Map,W=!1,E={value:0},_=null,j=null,me=!1,ge=!1,lo=null,F=null,po=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},L=(t)=>{o.parent.postMessage(t,"*")},uo=()=>{if(W||o.parent===o||re.size===0||_?.features?.lateGenerateResults!==!0)return;L({channel:S,v:f,type:"generate-late-listen"})},O=(t,n)=>{for(let d of t)try{d(n)}catch(l){console.error(l)}},_o=(t)=>{if(!(t instanceof MessageEvent))return;if(!r(t.source))return;let n=Bt(t.data);if(!n)return;if(n.type==="workspace"){let l=ie.get(n.payload.subscriptionId);if(l)O([l],n.payload.snapshot);return}if(n.type==="shells"){let l=ae.get(n.payload.subscriptionId);if(l)O([l],n.payload.snapshot);return}if(n.type==="microphone-audio"){F?.queue.push(n.payload.samples);return}if(n.type==="microphone-ended"){let l=F;if(!l)return;F=null,l.release(),O(l.endedListeners,n.payload.reason);return}if(n.type==="ready"){if(_=n.payload,j=po(n.payload.session),O(a,n.payload),O(u,n.payload.directory),O(h,n.payload.session),j)O(m,j);if(O(b,n.payload.connection),O(w,n.payload.settings),O(Z,n.payload.item),n.payload.block)O(Ce,n.payload.block);uo();return}if(n.type==="service-event"){O(Me,n.payload);return}if(n.type==="generate-late"){if(re.size===0)dt.push(n.payload);else O(re,n.payload);return}if(n.type==="directory"){if(_)_={..._,directory:n.payload.directory};O(u,n.payload.directory);return}if(n.type==="session"){if(_)_={..._,session:n.payload.session};if(!n.payload.session)j=null;else if(j?.sessionId!==n.payload.session.id)j=po(n.payload.session);O(h,n.payload.session);return}if(n.type==="session-lifecycle"){j=n.payload,O(m,n.payload);return}if(n.type==="connection"){if(_)_={..._,connection:n.payload.connection};O(b,n.payload.connection);return}if(n.type==="settings"){if(_)_={..._,settings:n.payload.settings};O(w,n.payload.settings);return}if(n.type==="item"){if(_)_={..._,item:n.payload.item};O(Z,n.payload.item);return}if(n.type==="status-control-event"){O(Ue,n.payload);return}if(n.type==="popover-closed"){O(Ne,n.payload);return}if(n.type==="action"){let l=(A)=>{if(!W)L({channel:S,v:f,type:"action-result",id:n.id,payload:A})},g=Se;if(!g){l({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>g(n.payload)).then(()=>l({ok:!0}),(A)=>{let x=(A instanceof Error?A.message:String(A)).trim();l({ok:!1,error:(x||"Action failed.").slice(0,Ae)})});return}if(n.type==="file-open"){let l=n.payload;if(he&&Mo(he,l))return;he=l,O(we,n.payload);return}if(n.type==="file-saved"){O(Le,n.payload.version);return}if(n.type==="file-snapshot"){let l=(x)=>{if(!W)L({channel:S,v:f,type:"file-snapshot-result",id:n.id,payload:x})},g=(x)=>l({error:(x.trim()||"Could not read the edited file.").slice(0,Ae)}),A=fe;if(!A){g("This extension does not edit files.");return}Promise.resolve().then(()=>A(n.payload.purpose)).then((x)=>{if(xt(x)>Xe){g(`The file is over ${Xe} ${"bytes"in x?"bytes":"characters"}.`);return}if(x.version.length>Ve){g(`The snapshot version is over ${Ve} characters.`);return}l({snapshot:"bytes"in x?{bytes:x.bytes,version:x.version}:{content:x.content,version:x.version}})},(x)=>g(x instanceof Error?x.message:String(x)));return}if(n.type==="resolve"){let l=(A)=>{L({channel:S,v:f,type:"resolve-result",id:n.id,payload:A})},g=Te;if(!g){l({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>g(n.payload)).then((A)=>l({item:A?de(A):null}),(A)=>{let x=(A instanceof Error?A.message:String(A)).trim();l({error:(x||"Command failed.").slice(0,Ae)})});return}let d=se.get(n.id);if(!d)return;if(clearTimeout(d.timer),se.delete(n.id),n.ok){d.resolve(n.payload);return}d.reject(new p(n.code,n.error))};o.addEventListener("message",_o),L({channel:S,v:f,type:"hello"});let M=(t,n=s)=>{if(W||o.parent===o)return Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((d,l)=>{let g=setTimeout(()=>{se.delete(t.id),l(new p("HOST_TIMEOUT","Host did not answer in time."))},n);se.set(t.id,{resolve:d,reject:l,timer:g}),L(t)})},y=(t)=>M(t).then(()=>{return}),k={channel:S,v:f},ut=(t)=>{if(!W&&o.parent!==o)L(t)},Eo=()=>ut({...k,type:"file-save"}),_t=()=>{if(!W&&o.parent!==o)L({...k,type:"microphone-close",id:T(E)})},yn=async()=>{if(F)throw new p("HOST_REJECTED","The microphone is already open in this frame.");if(_?.features?.microphone!==!0)throw new p("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let t=globalThis.AudioContext;if(typeof t!=="function")throw new p("UNSUPPORTED","This frame has no Web Audio.");let n=new t;if(n.sampleRate<mt||n.sampleRate>gt)throw n.close().catch(()=>{return}),new p("UNSUPPORTED",`Audio at ${n.sampleRate} Hz is not supported.`);let d=n.state==="suspended"?n.resume().catch(()=>{return}):void 0,l=xo(Math.round(n.sampleRate/4)),g=n.createScriptProcessor(1024,1,1);g.onaudioprocess=(K)=>l.pull(K.outputBuffer.getChannelData(0));let A=n.createMediaStreamDestination();g.connect(A);let x=new Set,ce={queue:l,endedListeners:x,release:()=>{g.onaudioprocess=null,g.disconnect(),l.clear();for(let K of A.stream.getTracks())K.stop();n.close().catch(()=>{return})}};F=ce;try{let K=await M({...k,type:"microphone-open",id:T(E),payload:{sampleRate:n.sampleRate}},At);if(!K||!("opened"in K)||K.opened!==!0)throw new p("HOST_REJECTED","Host did not open the microphone.");if(await d,F!==ce)throw new p("DISCONNECTED","The microphone closed while it was opening.")}catch(K){if(F===ce)F=null;throw ce.release(),_t(),K}return{stream:A.stream,close:()=>{if(F!==ce)return;F=null,ce.release(),_t()},onEnded:(K)=>(x.add(K),()=>{x.delete(K)})}},To=(t)=>{if(!on(t)||!Hn(t))return;t.preventDefault(),Eo()},So=(t)=>{if(!on(t)||t.key!=="Escape"||_?.surface!=="popover"||!_.popover)return;t.preventDefault(),go(_.popover.id,"escape").catch(()=>{return})},Pe=()=>{let t=_?.surface==="popover"?_.popover:void 0;if(!t)return;let n=me||ge;if(lo===n)return;lo=n,Ao(t.id,n).catch(()=>{return})},De=()=>{if(_?.surface!=="popover"||me)return;me=!0,Pe()},fo=(t)=>{if(_?.surface!=="popover"||t.relatedTarget!==null||!me)return;me=!1,Pe()},ho=()=>{if(_?.surface!=="popover"||ge)return;ge=!0,Pe()},mo=()=>{if(_?.surface!=="popover"||!ge)return;ge=!1,Pe()},z=(t,n=1024)=>{if(!t.trim()||t.length>n)throw new p("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},Et=async(t)=>{if(t.kind!=="projects")z(t.projectId);let n=await M({...k,type:"workspace-read",id:T(E),payload:t});if(!n||!("kind"in n)||!("state"in n)||n.kind!==t.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return n},Tt=async(t,n)=>{if(t.kind!=="projects")z(t.projectId);let d=T(E);ie.set(d,n);try{await y({...k,type:"workspace-subscribe",id:T(E),payload:{subscriptionId:d,query:t}})}catch(l){if(ie.delete(d),!W)L({...k,type:"workspace-unsubscribe",id:T(E),payload:{subscriptionId:d}});throw l}return()=>{if(!ie.delete(d)||W)return;L({...k,type:"workspace-unsubscribe",id:T(E),payload:{subscriptionId:d}})}},Cn=async(t,n)=>{if(t.kind==="session")z(t.sessionId);if(t.kind==="project")z(t.projectId);let d=T(E);ae.set(d,n);try{await y({...k,type:"shells-subscribe",id:T(E),payload:{subscriptionId:d,scope:t}})}catch(l){if(ae.delete(d),!W)L({...k,type:"shells-unsubscribe",id:T(E),payload:{subscriptionId:d}});throw l}return()=>{if(!ae.delete(d)||W)return;L({...k,type:"shells-unsubscribe",id:T(E),payload:{subscriptionId:d}})}},Ge=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>ft))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!le(t.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>ht)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&_?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let n=await M({...k,type:"storage",id:T(E),payload:t});if(!n||!("storage"in n)||n.op!==t.op)throw new p("HOST_REJECTED","Host did not return storage data.");return n},go=(t,n)=>_?.features?.popovers!==!0&&!(_?.surface==="popover"&&_.popover?.id===t)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):y({...k,type:"popover-close",id:T(E),payload:n?{id:t,reason:n}:{id:t}}),Ao=(t,n)=>_?.features?.popovers!==!0&&!(_?.surface==="popover"&&_.popover?.id===t)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):y({...k,type:"popover-anchor",id:T(E),payload:{id:t,active:n}});return o.addEventListener("keydown",So,!0),o.addEventListener("pointerover",De),o.addEventListener("pointermove",De),o.addEventListener("pointerout",fo),o.addEventListener("focus",ho),o.addEventListener("blur",mo),{onAction:(t)=>(Se=t,()=>{if(Se===t)Se=null}),listProjects:async()=>{let t=await Et({kind:"projects"});if(t.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let n=await Et({kind:"worktrees",projectId:t});if(n.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return n},listSessions:async(t)=>{let n=await Et({kind:"sessions",projectId:t});if(n.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return n},onProjects:(t)=>Tt({kind:"projects"},(n)=>{if(n.kind==="projects")t(n)}),onWorktrees:(t,n)=>Tt({kind:"worktrees",projectId:t},(d)=>{if(d.kind==="worktrees")n(d)}),onSessions:(t,n)=>Tt({kind:"sessions",projectId:t},(d)=>{if(d.kind==="sessions")n(d)}),onRunningShells:(t,n)=>Cn(t,n),readShellOutput:async(t,n)=>{z(t,He);let d=n?.cursor;if(d!==void 0&&(!Number.isInteger(d)||d<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let l=n?.tailBytes;if(l!==void 0&&(!Number.isInteger(l)||l<1||l>$e))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${$e}.`);let A=await M({...k,type:"shell-output",id:T(E),payload:{shellId:t,cursor:d,tailBytes:l}});if(!A||typeof A.output!=="string"||!Number.isFinite(A.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return A},stopShell:async(t)=>{if(z(t,He),(await M({...k,type:"shell-stop",id:T(E),payload:{shellId:t}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{z(t),await y({...k,type:"open-session",id:T(E),payload:{sessionId:t}})},storage:{get:async(t,n)=>{let d=qe(n),l={op:"get",key:t};if(d)l.scope=d;let g=await Ge(l);return g.op==="get"&&g.found?g.value:void 0},set:async(t,n,d)=>{let l=qe(d),g={op:"set",key:t,value:n};if(l)g.scope=l;await Ge(g)},delete:async(t,n)=>{let d=qe(n),l={op:"delete",key:t};if(d)l.scope=d;await Ge(l)},keys:async(t)=>{let n=qe(t),d={op:"keys"};if(n)d.scope=n;let l=await Ge(d);if(l.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return l.keys}},onReady:(t)=>{if(a.add(t),_)t(_);return()=>{a.delete(t)}},onDirectory:(t)=>{if(u.add(t),_)t(_.directory);return()=>{u.delete(t)}},onSession:(t)=>{if(h.add(t),_)t(_.session);return()=>{h.delete(t)}},onSessionLifecycle:(t)=>{if(m.add(t),j)t(j);return()=>{m.delete(t)}},onConnection:(t)=>{if(b.add(t),_)t(_.connection);return()=>{b.delete(t)}},onSettings:(t)=>{if(w.add(t),_)t(_.settings);return()=>{w.delete(t)}},onItem:(t)=>{if(Z.add(t),_)t(_.item);return()=>{Z.delete(t)}},onBlock:(t)=>{if(Ce.add(t),_?.block)t(_.block);return()=>{Ce.delete(t)}},onServiceEvent:(t)=>(Me.add(t),()=>{Me.delete(t)}),onStatusControl:(t)=>(Ue.add(t),()=>{Ue.delete(t)}),onPopoverClosed:(t)=>(Ne.add(t),()=>{Ne.delete(t)}),setStatusControls:(t)=>{if(_?.features?.statusControls!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support status controls."));if(!vo(t))return Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return y({...k,type:"status-controls",id:T(E),payload:{controls:t}})},openPopover:(t)=>{if(_?.features?.popovers!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support popovers."));if(!bt(t))return Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return y({...k,type:"popover-open",id:T(E),payload:t})},closePopover:go,setPopoverAnchorActive:Ao,onResolve:(t)=>(Te=t,()=>{if(Te===t)Te=null}),toast:(t)=>{let n=t.message.trim();if(!n||n.length>Fe)return Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${Fe} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Be))return Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${Be} characters.`));return y({channel:S,v:f,type:"toast",id:T(E),payload:{...t,message:n}})},openUrl:(t)=>y({channel:S,v:f,type:"open-url",id:T(E),payload:{url:t}}),...Do(y,()=>T(E),(t)=>Promise.reject(new p("HOST_REJECTED",t))),answerBlock:(t)=>y({channel:S,v:f,type:"block-answer",id:T(E),payload:{text:t.trim().slice(0,vt)}}),openSurface:(t)=>y({channel:S,v:f,type:"open-surface",id:T(E),payload:{surfaceId:t}}),writeClipboard:(t)=>y({channel:S,v:f,type:"clipboard-write",id:T(E),payload:{text:t}}),compose:(t)=>y({channel:S,v:f,type:"compose",id:T(E),payload:t}),attach:(t)=>y({channel:S,v:f,type:"attach",id:T(E),payload:de(t)}),startSession:async(t)=>{if(t.projectId!==void 0)z(t.projectId);let n=t.worktree;if(n&&n!==!0)if(n.kind==="existing")z(n.directory);else{if(n.name!==void 0)z(n.name,200);if(n.baseBranch!==void 0)z(n.baseBranch,200)}let d=await M({channel:S,v:f,type:"start-session",id:T(E),payload:wt(t)},e.requestTimeoutMs??180000);if(!yt(d))throw new p("HOST_REJECTED","Host did not return a session.");return d},prompt:(t)=>M({channel:S,v:f,type:"prompt",id:T(E),payload:Lt(t)}).then((n)=>{if(!Ct(n))throw new p("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:(t)=>y({channel:S,v:f,type:"session-link",id:T(E),payload:de(t)}),close:()=>y({channel:S,v:f,type:"close",id:T(E)}),oauthStart:()=>y({channel:S,v:f,type:"oauth-start",id:T(E)}),oauthDisconnect:()=>y({channel:S,v:f,type:"oauth-disconnect",id:T(E)}),request:(t)=>(Je(t.path)?M({channel:S,v:f,type:"request",id:T(E),payload:t}):nn()).then((n)=>{if(!Ye(n))throw new p("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:(t)=>(Je(t.path)?M({channel:S,v:f,type:"service-request",id:T(E),payload:t}):nn()).then((n)=>{if(!Ye(n))throw new p("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>M({channel:S,v:f,type:"service-status",id:T(E)}).then((t)=>{if(!Gt(t))throw new p("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(pe(t)?M({channel:S,v:f,type:"file-read",id:T(E),payload:{path:t}}):Qe()).then((n)=>{if(!Ht(n))throw new p("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(t,n)=>{if(!pe(t))return Qe();if(n.length>We)return Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${We} characters.`));return M({channel:S,v:f,type:"file-write",id:T(E),payload:{path:t,content:n}}).then((d)=>{if(!$t(d))throw new p("HOST_REJECTED","Host did not confirm the write.");return d})},listDir:(t)=>(pe(t)?M({channel:S,v:f,type:"file-list",id:T(E),payload:{path:t}}):Qe()).then((n)=>{if(!Xt(n))throw new p("HOST_REJECTED","Host did not return directory entries.");return n}),stat:(t)=>(pe(t)?M({channel:S,v:f,type:"file-stat",id:T(E),payload:{path:t}}):Qe()).then((n)=>{if(!Vt(n))throw new p("HOST_REJECTED","Host did not return file status.");return n}),generate:(t)=>{let n=t.prompt.trim(),d=t.system?.trim();if(n.length===0||n.length>ze)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${ze} characters.`));if(d!==void 0&&(d.length===0||d.length>je))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${je} characters.`));let l=t.maxOutputTokens===void 0?void 0:Math.min(Ut,Math.max(1,Math.floor(t.maxOutputTokens)));if(l!==void 0&&!Number.isFinite(l))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let g={prompt:n};if(d!==void 0)g.system=d;if(l!==void 0)g.maxOutputTokens=l;return M({channel:S,v:f,type:"generate",id:T(E),payload:g},e.requestTimeoutMs??Nt).then((A)=>{if(!Ft(A))throw new p("HOST_REJECTED","Host did not return generated text.");return A})},onLateGenerateResult:(t)=>{re.add(t);for(let n of dt.splice(0))O([t],n);return uo(),()=>{re.delete(t)}},openMicrophone:yn,setBadge:(t)=>y({channel:S,v:f,type:"badge",id:T(E),payload:{count:Pt(t)}}),setHeight:(t)=>y({channel:S,v:f,type:"resize",id:T(E),payload:{height:Dt(t)}}),onFileOpen:(t)=>{if(we.add(t),!pt)pt=!0,o.addEventListener("keydown",To,!0);if(he)t(he);return()=>{we.delete(t)}},onFileSnapshot:(t)=>(fe=t,()=>{if(fe===t)fe=null}),onFileSaved:(t)=>(Le.add(t),()=>{Le.delete(t)}),reportFileChange:(t)=>ut({...k,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:Eo,reportFileUnsupported:()=>ut({...k,type:"file-unsupported"}),dispose:()=>{for(let t of ie.keys())L({...k,type:"workspace-unsubscribe",id:T(E),payload:{subscriptionId:t}});ie.clear();for(let t of ae.keys())L({...k,type:"shells-unsubscribe",id:T(E),payload:{subscriptionId:t}});if(ae.clear(),F)_t(),F.release(),F=null;if(W=!0,Te=null,Se=null,fe=null,we.clear(),Le.clear(),pt)o.removeEventListener("keydown",To,!0);o.removeEventListener("message",_o),o.removeEventListener("keydown",So,!0),o.removeEventListener("pointerover",De),o.removeEventListener("pointermove",De),o.removeEventListener("pointerout",fo),o.removeEventListener("focus",ho),o.removeEventListener("blur",mo);for(let t of se.values())clearTimeout(t.timer),t.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));se.clear(),a.clear(),u.clear(),h.clear(),m.clear(),b.clear(),w.clear(),Z.clear(),Ce.clear(),Me.clear(),Ue.clear(),Ne.clear(),re.clear(),dt.length=0}}};var rn=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var zr=new Set(rn);var sn=["none","agent","user"];var Jr=new Set(sn);var $n=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],Xn=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],an=(e,o)=>{o.style.colorScheme=e.mode;for(let[r,s]of $n)o.style.setProperty(r,e.tokens[s]);for(let[r,s,a]of Xn){let u=e.tokens[a]??"";o.style.setProperty(r,u),o.style.setProperty(s,u)}o.style.setProperty("font-family",e.tokens.font),o.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),o.style.setProperty("line-height","1.45"),o.style.setProperty("color",e.tokens.foreground)},Wt=(e,o)=>{if(an(e.theme,o),o.dataset)o.dataset.ocSurface=e.surface,o.dataset.ocTheme=e.theme.mode};var Vn={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},R=(e,o)=>`var(--${e}, var(--oc-${Vn[e]}, ${o}))`,Y=R("surface-background","transparent"),et=R("surface-elevated","transparent"),ue=R("surface-elevated-foreground","inherit"),B=R("surface-foreground","inherit"),I=R("surface-muted-foreground","gray"),Fn=R("surface-muted","transparent"),te=R("interactive-border","currentColor"),P=R("interactive-hover","transparent"),oe=R("interactive-active","transparent"),zt=R("interactive-selection","transparent"),jt=R("interactive-selection-foreground","inherit"),J=R("primary","currentColor"),Jt=R("primary-text","inherit"),Yt=R("error-text","inherit"),Bn=R("font-sans","inherit"),Qt=R("font-mono","monospace"),pn=R("radius","9px"),qt=`calc(${pn} - 2px)`,cn=`calc(${pn} - 4px)`,v=(e,o,r="transparent")=>`color-mix(in srgb, ${e} ${o}%, ${r})`,ln=`background-image: linear-gradient(${P}, ${P});`,Zt=(e,o="0.5px")=>`box-shadow: inset 0 0 0 ${o} ${e}, var(--oc-sdk-field-lift);`,eo="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",dn="box-shadow: var(--oc-sdk-lit);",to=`inset 0 0.5px 0 0 ${v(B,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Kn=`
:root {
  --oc-sdk-edge: ${v(B,16)};
  --oc-sdk-field-bg: ${et};
  --oc-sdk-raised-bg: ${Y};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${v(B,14)};
  --oc-sdk-field-bg: ${v(Y,50,et)};
  --oc-sdk-raised-bg: ${et};
  --oc-sdk-field-lift: ${to};
  --oc-sdk-raised-lift: ${to};
  --oc-sdk-lit: ${to};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Ze=(e)=>{let o=R(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${o}; --oc-sdk-tone-text: ${R(`${e}-text`,"inherit")}; }`},c=(e)=>`calc(${e}rem / 14)`,Wn=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${c(8)}; height: ${c(32)}; padding: 0 ${c(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${c(6)}; height: ${c(28)}; padding: 0 ${c(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${c(4)}; height: ${c(24)}; padding: 0 ${c(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${c(14)}; height: ${c(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${c(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${c(32)}; padding: 0 ${c(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${c(8)} ${c(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${c(34)}; padding-right: ${c(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${c(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${c(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${c(24)}; height: ${c(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${c(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${c(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${c(28)}; padding: 0 ${c(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${c(2)}; min-width: ${c(160)}; max-width: calc(100vw - ${c(16)}); max-height: min(${c(320)}, calc(100vh - ${c(16)})); overflow: auto; padding: ${c(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${c(2)} ${c(2)} ${c(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${c(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${c(8)}; width: 100%; padding: ${c(6)} ${c(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${c(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${c(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${c(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${c(14)}; height: ${c(14)}; margin-top: ${c(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${c(36)}; height: ${c(20)}; --oc-sdk-thumb-travel: ${c(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${c(2)}; left: ${c(2)}; width: ${c(16)}; height: ${c(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${c(2)}; padding: ${c(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${c(6)}; height: ${c(28)}; padding: 0 ${c(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${c(1)} ${c(6)}; font-size: ${c(11)}; font-weight: 500; line-height: ${c(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${c(8)}; width: 100%; padding: ${c(6)} ${c(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${c(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${c(16)} ${c(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${c(4)}; padding: ${c(40)} ${c(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${c(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${c(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${c(16)}; height: ${c(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${c(12)}; height: ${c(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${c(12)}; padding: ${c(8)} ${c(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${c(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${c(8)}; width: 100%; margin: ${c(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${c(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${c(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${c(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${c(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${c(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${c(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${c(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${c(36)}; height: ${c(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${c(44)}; }
  .oc-sdk-check { min-height: ${c(36)}; padding: ${c(8)} 0; }
}
`,un=`${Kn}
.oc-sdk { color: ${B}; font-family: ${Bn}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${ln} }
.oc-sdk-mono { font-family: ${Qt}; }
.oc-sdk-muted { color: ${I}; }
${Ze("success")}${Ze("warning")}${Ze("error")}${Ze("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${J}; --oc-sdk-tone-text: ${Jt}; }

.oc-sdk-btn { border-radius: ${qt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${cn}; }
.oc-sdk-btn[data-variant="default"] { color: ${Jt}; background: ${v(J,10,Y)}; border-color: ${v(J,12)}; ${dn} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${v(J,16,Y)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${v(J,22,Y)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Fn}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${oe}, ${oe}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${ue}; ${eo} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${oe}, ${oe}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${P}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${oe}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${R("status-error","red")}; color: ${Yt}; background: ${v("var(--oc-sdk-tone)",7,Y)}; border-color: ${v("var(--oc-sdk-tone)",12)}; ${dn} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${v("var(--oc-sdk-tone)",9,Y)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${v("var(--oc-sdk-tone)",11,Y)}; box-shadow: none; }

.oc-sdk-field-note { color: ${I}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Yt}; }
.oc-sdk-input { border-radius: ${qt}; background: var(--oc-sdk-field-bg); color: ${ue}; ${Zt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${I}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Zt(v(B,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Zt(R("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Qt}; }

.oc-sdk-search-icon { color: ${I}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${J}; }
.oc-sdk-search-clear { border-radius: ${cn}; color: ${I}; }
.oc-sdk-search-clear:hover { background: ${P}; color: ${B}; }

.oc-sdk-trigger { border-radius: ${qt}; background: var(--oc-sdk-raised-bg); color: ${ue}; ${eo} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${oe}, ${oe}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${I}; }
.oc-sdk-trigger-chevron { color: ${I}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${ue}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${et}; background-clip: padding-box; color: ${ue}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${P}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${zt}; color: ${jt}; }
.oc-sdk-option-check { color: ${B}; }
.oc-sdk-option[data-destructive="true"] { color: ${Yt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${v(R("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${I}; }
.oc-sdk-popup-empty { color: ${I}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${te}; border-radius: 4px; color: ${B}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${v(B,60,te)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${te}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${Y}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${J}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${ln} }
.oc-sdk-check-desc { color: ${I}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${v(B,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${I}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${B}; }
.oc-sdk-tab[aria-selected="true"] { color: ${jt}; background: ${zt}; border-color: ${te}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${ue}; background: var(--oc-sdk-raised-bg); ${eo} }
.oc-sdk-tab-count { color: ${I}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${v(B,6)}; color: ${I}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${v("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${P}; }
.oc-sdk-row[aria-selected="true"] { background: ${zt}; color: ${jt}; }
.oc-sdk-row-lead { font-family: ${Qt}; color: ${I}; }
.oc-sdk-row-sub { color: ${I}; }
.oc-sdk-row-meta { color: ${I}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${I}; }

.oc-sdk-empty-body { color: ${I}; }

.oc-sdk-spinner { color: ${I}; }
.oc-sdk-spinner-ring { border-color: ${te}; border-top-color: ${J}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${v("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${I}; }

.oc-sdk-separator { color: ${I}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${v(te,40)}; }

.oc-sdk-progress-label { color: ${I}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${v(B,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${J}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${R("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${R("success-text","inherit")}; }

.oc-sdk-text a { color: ${Jt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${v(te,60)}; }
`,U=`
${St}
${Wn}
${un}`;var Qn={NO_SERVICE:{title:"Local service not allowed",message:"This extension reads mise through a local service. Allow it in Settings → Extensions.",settings:!0},DISABLED:{title:"Extension paused",message:"Resume the mise extension in Settings → Extensions.",settings:!0},SERVICE_FAILED:{title:"The mise service did not start",message:"The local service crashed or never became ready. Try again; if it keeps failing, check Settings → Extensions."},REQUEST_FAILED:{title:"No answer from the mise service",message:"The request was sent but no usable answer came back."},HOST_TIMEOUT:{title:"mise took too long",message:"OpenChamber stopped waiting for the mise service."},RESPONSE_TOO_LARGE:{title:"Too much output",message:"The mise service answered with more than OpenChamber accepts."}},qn={"invalid-scope":"Nothing to inspect here","bad-request":"Nothing to inspect here","no-git":"git not found","no-mise":"mise not found",busy:"mise is busy",unauthorized:"Service refused the request","not-found":"Unknown operation"},Zn=(e)=>typeof e==="object"&&e!==null&&typeof e.error?.code==="string",er=async(e,o)=>{let r;try{r=await e.serviceRequest(o)}catch(a){let u=a instanceof p?a.code:"HOST_UNAVAILABLE",h=Qn[u];return{ok:!1,problem:{code:u,...h??{title:"OpenChamber is unavailable",message:a instanceof Error?a.message:String(a)}}}}let s;try{s=JSON.parse(r.body)}catch{return{ok:!1,problem:{code:"bad-answer",title:"Unexpected answer",message:`The mise service answered HTTP ${r.status} with something that is not JSON.`}}}if(Zn(s)){let{code:a,message:u,searched:h}=s.error;return{ok:!1,problem:{code:a,title:qn[a]??"mise service error",message:u,searched:h}}}return{ok:!0,data:s}},_n=async(e,o,r)=>{let s=await er(e,{method:"GET",path:"/inspect",query:{directory:o,parts:r.join(",")}});if(!s.ok)return s;let a=s.data;if(typeof a?.scope?.directory!=="string"||typeof a?.mise?.path!=="string")return{ok:!1,problem:{code:"bad-answer",title:"Unexpected answer",message:"The mise service answered in a shape this panel does not understand."}};return{ok:!0,data:a}},En=(e,o)=>{e.serviceRequest({method:"POST",path:"/pins-changed",body:JSON.stringify({directory:o})}).catch(()=>{return})};var i=(e,o=null,...r)=>{let s=document.createElement(e);if(o){if(o.class)s.className=o.class;if(o.title)s.title=o.title;if(o.text!==void 0)s.textContent=o.text;if(o.html!==void 0)s.innerHTML=o.html;for(let[a,u]of Object.entries(o.attrs??{}))if(u!==null&&u!==void 0&&u!==!1)s.setAttribute(a,u);for(let[a,u]of Object.entries(o.style??{}))s.style.setProperty(a,u);for(let[a,u]of Object.entries(o.on??{}))if(u)s.addEventListener(a,u)}for(let a of r){if(a===null||a===void 0||a===!1)continue;s.append(typeof a==="string"?document.createTextNode(a):a)}if(e==="button"&&!(o?.attrs&&("type"in o.attrs)))s.type="button";return s};var N=(e,o="")=>`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${o}>${e}</svg>`,C={pin:N('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z"/><path d="M12 13.8V20.5"/>'),pinFilled:N('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z" fill="currentColor"/><path d="M12 13.8V20.5"/>'),refresh:N('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.5H15"/>'),branch:N('<circle cx="6.5" cy="5.5" r="2"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="7.5" r="2"/><path d="M6.5 7.5v9"/><path d="M17.5 9.5c0 4-3.5 5-11 7"/>'),shield:N('<path d="M12 3.2 19.5 6v5.6c0 4.6-3.2 7.9-7.5 9.2-4.3-1.3-7.5-4.6-7.5-9.2V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),search:N('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>'),chevron:N('<path d="m9.5 6 6 6-6 6"/>'),alert:N('<path d="M12 4 21.5 20h-19z"/><path d="M12 10.5v4"/><path d="M12 17.5h.01"/>'),x:N('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),terminal:N('<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7.5 10 3 2.5-3 2.5"/><path d="M12.5 15.5h4"/>'),box:N('<path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z"/><path d="M4 7.6 12 12l8-4.4"/><path d="M12 12v8.8"/>'),layers:N('<path d="m12 3.5 9 4.7-9 4.7-9-4.7z"/><path d="m3 12.4 9 4.7 9-4.7"/><path d="m3 16.4 9 4.7 9-4.7" opacity=".55"/>'),folder:N('<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'),open:N('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4"/>'),knife:N('<path d="M20.5 3.5c.9 3.4-1.1 7-4.6 10.4l-2.6-2.6"/><path d="m13.3 11.3 7.2-7.8"/><path d="m12.1 12.5-7.6 7.6a1.5 1.5 0 0 1-2.1-2.1L10 10.4"/><path d="m10 10.4 2.1 2.1"/>')};var tr=(e)=>{let o=2166136261;for(let r=0;r<e.length;r++)o=Math.imul(o^e.charCodeAt(r),16777619);return(o>>>0).toString(36)},no=(e)=>`pins:v1:${tr(e)}`,Tn=40,or=(e,o)=>{if(e===void 0)return[];let r=e;if(!r||r.v!==1||!Array.isArray(r.tasks))return null;if(r.directory!==o)return[];return r.tasks.filter((s)=>typeof s==="string"&&s.length>0&&s.length<=200).slice(0,Tn)};class ro{host;chain=Promise.resolve();constructor(e){this.host=e}async read(e){try{let o=or(await this.host.storage.get(no(e)),e);return o?{ok:!0,pins:o}:{ok:!1,message:"Saved pins for this checkout are unreadable."}}catch{return{ok:!1,message:"Could not read pins from extension storage."}}}update(e,o){let r=this.chain.then(async()=>{let s=await this.read(e);if(!s.ok)throw Error(s.message);let a=[...new Set(o(s.pins))].slice(0,Tn);if(a.length)await this.host.storage.set(no(e),{v:1,directory:e,tasks:a});else await this.host.storage.delete(no(e));return En(this.host,e),a});return this.chain=r.catch(()=>{return}),r}toggle(e,o){return this.update(e,(r)=>r.includes(o)?r.filter((s)=>s!==o):[...r,o])}remove(e,o){return this.update(e,(r)=>r.filter((s)=>s!==o))}}var Sn=`
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; background: var(--oc-bg); color: var(--oc-fg); }
body { font-family: var(--oc-font, system-ui, sans-serif); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--oc-focus, var(--oc-primary)); outline-offset: 1px; border-radius: 6px; }

/* Where a value came from. --k fills, --kt is readable text on neutral surfaces. */
.k-global   { --k: var(--oc-muted);   --kt: var(--oc-muted); }
.k-parent   { --k: var(--oc-info);    --kt: var(--oc-info-text); }
.k-root     { --k: var(--oc-primary); --kt: var(--oc-primary-text); }
.k-local    { --k: var(--oc-success); --kt: var(--oc-success-text); }
.k-other    { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.k-computed { --k: var(--oc-syntax-type, var(--oc-muted)); --kt: var(--oc-syntax-type, var(--oc-muted)); }
.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--k, var(--oc-muted));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--k, var(--oc-muted)) 16%, transparent); }

.mono { font-family: var(--oc-mono, ui-monospace, monospace); font-variant-ligatures: none; }
.muted { color: var(--oc-muted); }
.trunc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

.iconbtn { width: 26px; height: 26px; flex: none; display: inline-grid; place-items: center; border: 0; border-radius: 8px;
  background: transparent; color: var(--oc-muted); cursor: pointer; transition: background .12s, color .12s; }
.iconbtn:hover { background: var(--oc-hover); color: var(--oc-fg); }
.iconbtn svg { width: 15px; height: 15px; }
.iconbtn[disabled] { opacity: .45; cursor: default; }
.spin svg { animation: oc-spin .9s linear infinite; }
@keyframes oc-spin { to { transform: rotate(360deg); } }

.btn { height: 28px; padding: 0 12px; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;
  border: 1px solid var(--oc-border); background: var(--oc-elevated); font-size: .78em; font-weight: 550; cursor: pointer; }
.btn:hover { background: var(--oc-hover); }
.btn svg { width: 13px; height: 13px; }
.btn.ghost { border-color: transparent; background: transparent; color: var(--oc-muted); padding: 0 8px; }
.btn.ghost:hover { color: var(--oc-fg); background: var(--oc-hover); }

.chip { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px; border-radius: 6px; max-width: 100%;
  font-size: .72em; font-weight: 520; white-space: nowrap; background: var(--oc-muted-surface); color: var(--oc-fg); }
.chip svg { width: 12px; height: 12px; flex: none; }
.chip.t-warning { background: color-mix(in srgb, var(--oc-warning) 14%, transparent); color: var(--oc-warning-text); }
.chip.t-success { background: color-mix(in srgb, var(--oc-success) 14%, transparent); color: var(--oc-success-text); }
.chip.t-info    { background: color-mix(in srgb, var(--oc-info) 14%, transparent);    color: var(--oc-info-text); }
.chip.t-primary { background: color-mix(in srgb, var(--oc-primary) 14%, transparent); color: var(--oc-primary-text); }

.badge { display: inline-flex; align-items: center; height: 17px; padding: 0 6px; border-radius: 5px; font-size: .64em;
  font-weight: 650; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap;
  background: color-mix(in srgb, var(--k, var(--oc-muted)) 13%, transparent); color: var(--kt, var(--oc-muted)); }
.badge.warn { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.badge.ok { --k: var(--oc-success); --kt: var(--oc-success-text); }

.problem { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; padding: 10px 11px; border-radius: 10px;
  font-size: .78em; line-height: 1.45; background: color-mix(in srgb, var(--oc-warning) 10%, transparent); }
.problem > svg { width: 15px; height: 15px; margin-top: 1px; color: var(--oc-warning-text); }
.problem.error { background: color-mix(in srgb, var(--oc-error) 10%, transparent); }
.problem.error > svg { color: var(--oc-error-text); }
.problem b { display: block; font-weight: 620; margin-bottom: 1px; }
.problem pre { margin: 6px 0 0; font-family: var(--oc-mono, monospace); font-size: .92em; white-space: pre-wrap; word-break: break-word; color: var(--oc-muted); }

.skel { border-radius: 8px; background: linear-gradient(90deg, var(--oc-muted-surface) 0%,
  color-mix(in srgb, var(--oc-muted-surface) 35%, transparent) 50%, var(--oc-muted-surface) 100%);
  background-size: 200% 100%; animation: oc-shimmer 1.4s ease-in-out infinite; }
@keyframes oc-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .skel, .spin svg { animation: none; } }
`,fn=`
.wrap { container-type: inline-size; padding: 10px 10px 14px; }
.bento { display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr); }
.tile { position: relative; min-width: 0; padding: 12px; border-radius: 14px; background: var(--oc-elevated);
  border: 1px solid color-mix(in srgb, var(--oc-border) 70%, transparent); }
.tile.flush { padding: 0; overflow: hidden; }
.tile-head { display: flex; align-items: center; gap: 8px; min-height: 24px; margin-bottom: 8px; }
.eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: .68em; font-weight: 650; letter-spacing: .08em;
  text-transform: uppercase; color: var(--oc-muted); }
.eyebrow svg { width: 13px; height: 13px; }
.count { font-family: var(--oc-mono, monospace); font-size: .68em; font-variant-numeric: tabular-nums; color: var(--oc-muted);
  background: var(--oc-muted-surface); border-radius: 999px; padding: 1px 7px; }
.grow { flex: 1; }

/* Hero */
.hero { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 14px;
  background: radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--oc-primary) 11%, var(--oc-elevated)) 0%, var(--oc-elevated) 58%); }
.glyph { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center;
  background: color-mix(in srgb, var(--oc-primary) 15%, transparent); color: var(--oc-primary-text); }
.glyph svg { width: 21px; height: 21px; }
.glyph.monogram { font-size: 1.15em; font-weight: 680; letter-spacing: -.02em; }
.hero h1 { margin: 0; font-size: 1.22em; font-weight: 660; letter-spacing: -.018em; line-height: 1.2; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 6px; }
.path { margin-top: 7px; font-size: .72em; color: var(--oc-muted); }
.hero .actions { align-self: start; display: flex; gap: 2px; }

/* Stats strip */
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.stat { all: unset; cursor: pointer; padding: 10px 12px 11px; min-width: 0; transition: background .12s; }
.stat:hover { background: var(--oc-hover); }
.stat:focus-visible { outline: 2px solid var(--oc-focus, var(--oc-primary)); outline-offset: -2px; }
.stat + .stat { border-left: 1px solid color-mix(in srgb, var(--oc-border) 55%, transparent); }
.stat-num { font-size: 1.55em; font-weight: 640; letter-spacing: -.03em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.stat-label { margin-top: 3px; font-size: .7em; color: var(--oc-muted); display: flex; gap: 6px; align-items: baseline; }
.stat-note { color: var(--oc-warning-text); font-weight: 560; }
.stat.failed .stat-num { color: var(--oc-warning-text); }

/* Pinned */
.pinned { background: linear-gradient(180deg, color-mix(in srgb, var(--oc-primary) 6%, var(--oc-elevated)), var(--oc-elevated)); }
.pins { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.pin { display: grid; grid-template-columns: 14px minmax(0, 1fr) auto; gap: 8px; align-items: start; padding: 8px 6px 8px 9px; border-radius: 10px;
  text-align: left; cursor: pointer; background: color-mix(in srgb, var(--oc-primary) 6%, var(--oc-bg));
  border: 1px solid color-mix(in srgb, var(--oc-primary) 22%, transparent); transition: border-color .12s, background .12s; }
.pin:hover { border-color: color-mix(in srgb, var(--oc-primary) 45%, transparent); }
.pin > svg { width: 14px; height: 14px; margin-top: 1px; color: var(--oc-primary-text); }
.pin .name { font-size: .8em; font-weight: 580; }
.pin .desc { font-size: .72em; color: var(--oc-muted); margin-top: 1px; }
.pin.missing { border-style: dashed; background: transparent; border-color: var(--oc-border); }
.pin.missing > svg, .pin.missing .name { color: var(--oc-muted); }
.pin .iconbtn { width: 20px; height: 20px; opacity: 0; margin-top: -2px; }
.pin .iconbtn svg { width: 12px; height: 12px; }
.pin:hover .iconbtn, .pin .iconbtn:focus-visible { opacity: 1; }
.hint { padding: 11px 12px; border-radius: 10px; border: 1px dashed color-mix(in srgb, var(--oc-border) 90%, transparent);
  font-size: .76em; color: var(--oc-muted); line-height: 1.45; }

/* Tasks */
.search { display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 8px; margin-left: auto; width: min(200px, 52%);
  border-radius: 8px; background: var(--oc-bg); border: 1px solid color-mix(in srgb, var(--oc-border) 70%, transparent); }
.search:focus-within { border-color: var(--oc-focus, var(--oc-primary)); }
.search svg { width: 13px; height: 13px; color: var(--oc-muted); flex: none; }
.search input { all: unset; flex: 1; min-width: 0; font-size: .76em; color: var(--oc-fg); }
.search input::placeholder { color: var(--oc-muted); }
.tasks { display: grid; gap: 1px; margin: 0 -4px; }
.task { border-radius: 10px; }
.task.open { background: color-mix(in srgb, var(--oc-hover) 70%, transparent); }
.task.hidden-task .task-name { color: var(--oc-muted); }
.task.flash { animation: oc-flash 1.2s ease-out; }
@keyframes oc-flash { from { box-shadow: inset 0 0 0 1px var(--oc-primary); } to { box-shadow: inset 0 0 0 1px transparent; } }
.task-row { display: grid; grid-template-columns: 24px auto minmax(0, 1fr) auto; gap: 8px; align-items: center;
  padding: 4px 8px 4px 4px; border-radius: 10px; cursor: pointer; }
.task-row:hover { background: var(--oc-hover); }
.task-name { font-size: .8em; font-weight: 560; white-space: nowrap; }
.task-row .dot, .tool .dot { width: 6px; height: 6px; box-shadow: none; }
.task-full { font-size: .8em; line-height: 1.5; }
.task-desc { font-size: .76em; color: var(--oc-muted); }
.task-tail { display: flex; gap: 8px; align-items: center; }
.task-tail .chev { width: 14px; height: 14px; color: var(--oc-muted); transition: transform .15s; }
.task.open .chev { transform: rotate(90deg); }
.pinbtn { width: 24px; height: 24px; }
.pinbtn.on { color: var(--oc-primary-text); }
.task-body { display: grid; gap: 8px; padding: 2px 10px 11px 36px; }
.kv { display: grid; grid-template-columns: 68px minmax(0, 1fr); gap: 4px 10px; margin: 0; font-size: .74em; }
.kv dt { color: var(--oc-muted); }
.kv dd { margin: 0; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; min-width: 0; }
.kv .chip { font-family: var(--oc-mono, monospace); font-size: 1em; height: 18px; }
pre.script { margin: 0; padding: 8px 10px; border-radius: 8px; overflow-x: auto; white-space: pre; tab-size: 2;
  font-size: .74em; line-height: 1.6; background: var(--oc-bg); border: 1px solid color-mix(in srgb, var(--oc-border) 65%, transparent); }
pre.script .p { color: var(--oc-muted); user-select: none; }
.list-foot { display: flex; justify-content: center; padding-top: 6px; }
.none { padding: 14px 4px 6px; text-align: center; font-size: .78em; color: var(--oc-muted); }

/* Tools */
.tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
.tool { display: grid; gap: 3px; min-width: 0; padding: 9px 10px 10px; border-radius: 10px; background: var(--oc-bg);
  border: 1px solid color-mix(in srgb, var(--oc-border) 60%, transparent); }
.tool-name { display: flex; align-items: center; gap: 6px; font-size: .74em; font-weight: 600; }
.tool-req { margin-left: auto; font-size: .92em; font-weight: 450; color: var(--oc-muted); }
.tool-ver { font-size: .98em; font-weight: 560; letter-spacing: -.01em; }
.tool-state { font-size: .68em; color: var(--oc-muted); }
.tool-state.active { color: var(--oc-success-text); }
.tool-state.missing { color: var(--oc-warning-text); }

/* Config chain */
.chain { list-style: none; margin: 0; padding: 0; }
.chain li { position: relative; display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 10px; padding: 5px 0 7px; }
.chain li::before { content: ''; position: absolute; left: 5.5px; top: 17px; bottom: -6px; width: 1px;
  background: color-mix(in srgb, var(--oc-border) 85%, transparent); }
.chain li:last-child::before { display: none; }
.chain .dot { margin-top: 5px; }
.cfg-path { font-size: .78em; font-weight: 500; }
.cfg-meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; align-items: center; }
.cfg-tools { font-size: .7em; color: var(--oc-muted); margin-top: 3px; }

/* Footer */
.foot { display: grid; gap: 8px; padding: 10px 12px; font-size: .7em; color: var(--oc-muted); line-height: 1.45;
  background: transparent; border-style: dashed; }
.foot-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
.foot svg { width: 13px; height: 13px; flex: none; }
.foot .safe { display: inline-flex; gap: 6px; align-items: center; color: var(--oc-success-text); font-weight: 600; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 12px; }
.legend span { display: inline-flex; gap: 6px; align-items: center; }

/* Whole-panel states */
.state { display: grid; justify-items: center; gap: 8px; padding: 40px 22px; text-align: center; }
.state .glyph { width: 46px; height: 46px; border-radius: 14px; }
.state h2 { margin: 4px 0 0; font-size: 1em; font-weight: 640; letter-spacing: -.01em; }
.state p { margin: 0; max-width: 36ch; font-size: .8em; line-height: 1.5; color: var(--oc-muted); }
.state details { max-width: 100%; font-size: .72em; color: var(--oc-muted); text-align: left; }
.state details pre { margin: 6px 0 0; white-space: pre-wrap; word-break: break-all; }
.state.warn .glyph { background: color-mix(in srgb, var(--oc-warning) 14%, transparent); color: var(--oc-warning-text); }

/* Bento breakpoints follow the panel's own width. */
@container (min-width: 560px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .span-all { grid-column: 1 / -1; }
}
@container (min-width: 880px) {
  .bento { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .hero { grid-column: span 2; }
  .stats-tile { grid-column: span 1; }
  .stats-tile .stats { height: 100%; grid-template-columns: minmax(0, 1fr); grid-auto-rows: 1fr; }
  .stats-tile .stat { display: flex; align-items: baseline; gap: 10px; padding: 8px 14px; }
  .stats-tile .stat + .stat { border-left: 0; border-top: 1px solid color-mix(in srgb, var(--oc-border) 55%, transparent); }
  .stats-tile .stat-num { font-size: 1.3em; min-width: 1.6em; }
  .stats-tile .stat-label { margin-top: 0; }
  .tasks-tile { grid-column: span 2; grid-row: span 2; }
  .tools-tile, .configs-tile { grid-column: span 1; }
}
`;var hn=(...e)=>{let o=document.createElement("style");o.textContent=e.join(`
`),document.head.append(o)};var mn=["tasks","tools","configs"];var ne=Kt(),bn=new ro(ne);hn(Sn,fn);var st=document.querySelector("#root"),ve=null,gn=!1,it=0,X={kind:"loading"},Re=!1,An=new Map,H=[],ye=null,Ee="",xe=!1,be=!1,ke=new Set,so=null,On=30,io={global:"global",parent:"parent",root:"checkout",local:"subfolder",other:"other",computed:"computed"},Ie=()=>X.kind==="ready"?X.data.scope.directory:null,at=async()=>{let e=ve,o=++it;if(!e){X={kind:"empty"},Re=!1,V();return}let r=An.get(e);if(r)X={kind:"ready",data:r},Re=!0;else X={kind:"loading"},H=[],ye=null;V();let s=await _n(ne,e,[...mn]);if(o!==it||e!==ve)return;if(Re=!1,!s.ok){X={kind:"problem",problem:s.problem},V();return}An.set(e,s.data),X={kind:"ready",data:s.data},await kn(s.data.scope.directory,o),V()},kn=async(e,o=it)=>{let r=await bn.read(e);if(o!==it||Ie()!==e)return;if(r.ok)H=r.pins,ye=null;else ye=r.message},In=(e)=>{let o=Ie();if(!o)return;let r=H;H=H.includes(e)?H.filter((s)=>s!==e):[...H,e],V(),bn.toggle(o,e).then((s)=>{if(Ie()===o)H=s,V()}).catch((s)=>{if(Ie()===o)H=r,V();ne.toast({kind:"error",message:s instanceof Error?s.message:"Could not save the pin."})})},xn=(e)=>{if(Ee="",ke.add(e),ee(X.kind==="ready"?X.data.tasks:void 0)?.find((r)=>r.name===e)?.hidden)xe=!0;be=!0,so=e,V(),st.querySelector(`[data-task="${CSS.escape(e)}"]`)?.scrollIntoView({block:"center",behavior:"smooth"}),so=null},ee=(e)=>e?.ok?e.data:null,q=(e)=>i("span",{html:e,style:{display:"contents"}}),ao=(e,o,r,s="")=>i("button",{class:`iconbtn ${s}`.trim(),title:o,attrs:{"aria-label":o},html:e,on:{click:(a)=>{a.stopPropagation(),r(a)}}}),co=(e,o,r)=>i("div",{class:"tile-head"},i("span",{class:"eyebrow"},q(e),o),r===void 0?null:i("span",{class:"count"},String(r))),ct=(e)=>i("span",{class:`dot k-${e}`,attrs:{"aria-hidden":"true"}}),nr={"safe-mode-refused":"Not read: safe mode refused this config",untrusted:"Not read: config is untrusted","parse-error":"Not read: config has an error",timeout:"Not read: mise timed out","output-too-large":"Not read: output too large","bad-json":"Not read: unexpected mise output","mise-failed":"Not read: mise failed"},lt=(e)=>i("div",{class:`problem ${e.code==="safe-mode-refused"?"":"error"}`.trim()},q(C.alert),i("div",null,i("b",null,nr[e.code]),e.message,e.detail?i("pre",null,e.detail):null)),rr=(e)=>{let{scope:o}=e;return i("section",{class:"tile hero span-all"},i("div",{class:"glyph monogram",attrs:{"aria-hidden":"true"}},(o.name.match(/[a-z0-9]/i)?.[0]??"m").toUpperCase()),i("div",{class:"trunc"},i("h1",{class:"trunc",title:o.root},o.name),i("div",{class:"meta"},o.branch?i("span",{class:"chip",title:"Branch"},q(C.branch),i("span",{class:"trunc"},o.branch)):null,o.kind==="mise"?i("span",{class:"chip",title:"Not a git checkout: the root is the highest folder here with its own mise config"},q(C.folder),"mise project"):null,o.linkedWorktree?i("span",{class:"chip t-info",title:"A linked git worktree. Its pins are separate from the main checkout."},"worktree"):null,o.directory!==o.root?i("span",{class:"chip t-primary",title:"Inspecting a folder inside the checkout"},"subfolder"):null),i("div",{class:"path mono trunc",title:o.directory},o.label)),i("div",{class:"actions"},ao(C.refresh,Re?"Refreshing…":"Refresh",()=>{at()},Re?"spin":"")))},sr=(e)=>{let o=ee(e.tasks),r=ee(e.tools),s=ee(e.configs),a=r?.filter((m)=>!m.installed).length??0,u=s?.filter((m)=>m.trust==="untrusted").length??0,h=(m,b,w,Z)=>i("button",{class:`stat ${b===null?"failed":""}`.trim(),title:b===null?`${w}: not read`:`Jump to ${w.toLowerCase()}`,on:{click:()=>st.querySelector(`.${m}`)?.scrollIntoView({block:"start",behavior:"smooth"})}},i("div",{class:"stat-num"},b===null?"—":String(b)),i("div",{class:"stat-label"},w,Z?i("span",{class:"stat-note"},Z):null));return i("section",{class:"tile flush stats-tile span-all"},i("div",{class:"stats"},h("tasks-tile",o?o.filter((m)=>!m.hidden).length:null,"Tasks",null),h("tools-tile",r?r.length:null,"Tools",a?`${a} missing`:null),h("configs-tile",s?s.length:null,"Configs",u?`${u} untrusted`:null)))},ir=(e)=>{let o=ee(e.tasks),r=new Map((o??[]).map((a)=>[a.name,a])),s;if(ye)s=lt({code:"mise-failed",message:ye,detail:null});else if(!H.length)s=i("div",{class:"hint"},"Pin tasks with ",i("span",{html:C.pin,style:{display:"inline-flex",width:"12px","vertical-align":"-2px"}})," below to keep them here and in Work Status. Pins belong to this checkout only.");else s=i("div",{class:"pins"},...H.map((a)=>{let u=r.get(a),h=o!==null&&!u;return i("div",{class:`pin ${h?"missing":""}`.trim(),title:h?`${a} is pinned but no longer defined here`:`Show ${a}`,attrs:{role:"button",tabindex:"0"},on:{click:()=>{if(!h)xn(a)},keydown:(m)=>{if(m.key==="Enter"&&!h)xn(a)}}},q(C.pinFilled),i("div",{class:"trunc"},i("div",{class:"name mono trunc"},a),i("div",{class:"desc trunc"},h?"not defined in this checkout":u?.description||(o?"no description":"tasks not read"))),ao(C.x,`Unpin ${a}`,()=>In(a)))}));return i("section",{class:"tile pinned span-all"},co(C.pin,"Pinned",H.length||void 0),s)},ar=(e)=>{if(e.file)return i("pre",{class:"script mono"},i("span",{class:"p"},"# "),"file task: the file is the script");if(!e.run.length)return null;let o=i("pre",{class:"script mono"});if(e.run.forEach((r,s)=>{if(s)o.append(`
`);o.append(i("span",{class:"p"},"$ "),r)}),e.runTruncated)o.append(`
`,i("span",{class:"p"},"… truncated"));return o},cr=(e)=>{let o=ke.has(e.name),r=H.includes(e.name),s=()=>{if(o)ke.delete(e.name);else ke.add(e.name);V()},a=(u)=>i("dd",null,...u.map((h)=>i("span",{class:"chip"},h)));return i("div",{class:["task",o&&"open",e.hidden&&"hidden-task",so===e.name&&"flash"].filter(Boolean).join(" "),attrs:{"data-task":e.name}},i("div",{class:"task-row",attrs:{role:"button",tabindex:"0","aria-expanded":String(o)},on:{click:s,keydown:(u)=>{if(u.key==="Enter")s()}}},ao(r?C.pinFilled:C.pin,r?`Unpin ${e.name}`:`Pin ${e.name}`,()=>In(e.name),`pinbtn ${r?"on":""}`),i("span",{class:"task-name mono"},e.name),i("span",{class:"task-desc trunc"},e.description),i("span",{class:"task-tail"},i("span",{class:`dot k-${e.source.kind}`,title:`${io[e.source.kind]} · ${e.source.label??"computed"}`}),i("span",{class:"chev",html:C.chevron}))),o?i("div",{class:"task-body"},e.description.length>56?i("div",{class:"task-full"},e.description):null,i("dl",{class:"kv"},i("dt",null,"source"),i("dd",{class:`k-${e.source.kind}`},ct(e.source.kind),i("span",{class:"mono trunc",title:e.source.path??""},e.source.label??"computed by mise")),e.dir&&e.dir!=="."?i("dt",null,"runs in"):null,e.dir&&e.dir!=="."?i("dd",{class:"mono"},e.dir):null,e.aliases.length?i("dt",null,"aliases"):null,e.aliases.length?a(e.aliases):null,e.depends.length?i("dt",null,"depends"):null,e.depends.length?a(e.depends):null,e.hidden?i("dt",null,"hidden"):null,e.hidden?i("dd",null,"yes — not listed by mise tasks by default"):null),ar(e)):null)},lr=(e)=>{let o=ee(e)??[],r=o.filter((b)=>b.hidden).length,s=Ee.trim().toLowerCase(),a=o.filter((b)=>(xe||!b.hidden||H.includes(b.name))&&(!s||[b.name,b.description,...b.aliases].some((w)=>w.toLowerCase().includes(s)))),u=be||s?a:a.slice(0,On),h=i("label",{class:"search"},q(C.search),i("input",{attrs:{type:"search",placeholder:"Filter tasks","aria-label":"Filter tasks",value:Ee,"data-focus":"filter",spellcheck:"false"},on:{input:(b)=>{Ee=b.target.value,V()}}})),m;if(e&&!e.ok)m=lt(e.error);else if(!o.length)m=i("div",{class:"none"},"No tasks defined for this checkout.");else m=i("div",null,u.length?i("div",{class:"tasks"},...u.map(cr)):i("div",{class:"none"},`No task matches “${Ee}”.`),i("div",{class:"list-foot"},!s&&!be&&a.length>On?i("button",{class:"btn ghost",on:{click:()=>{be=!0,V()}}},`Show all ${a.length}`):null,r?i("button",{class:"btn ghost",on:{click:()=>{xe=!xe,V()}}},xe?`Hide ${r} hidden`:`Show ${r} hidden`):null));return i("section",{class:"tile tasks-tile span-all"},i("div",{class:"tile-head"},i("span",{class:"eyebrow"},q(C.terminal),"Tasks"),o.length?i("span",{class:"count"},s?`${a.length}/${o.length}`:String(o.length-r)):null,o.length?h:null),m)},dr=(e)=>{let o=ee(e)??[],r;if(e&&!e.ok)r=lt(e.error);else if(!o.length)r=i("div",{class:"none"},"No tools requested here.");else r=i("div",{class:"tools"},...o.map((s)=>{let a=!s.installed?"missing":s.active?"active":"installed",u=s.requested&&s.requested!==s.version?s.requested:null;return i("div",{class:`tool k-${s.source.kind}`,title:`${s.name} ${s.version} · ${s.source.label??"computed"}${u?` · requested ${u}`:""}`},i("div",{class:"tool-name"},ct(s.source.kind),i("span",{class:"trunc"},s.name),u?i("span",{class:"tool-req mono trunc"},`@${u}`):null),i("div",{class:"tool-ver mono trunc"},s.version),i("div",{class:`tool-state ${a}`},a==="missing"?"not installed":a))}));return i("section",{class:"tile tools-tile"},co(C.box,"Tools",o.length||void 0),r)},pr=(e)=>{let o=ee(e)??[],r;if(e&&!e.ok)r=lt(e.error);else if(!o.length)r=i("div",{class:"none"},"No mise config applies here.");else r=i("ol",{class:"chain"},...o.map((s)=>i("li",{class:`k-${s.source.kind}`},ct(s.source.kind),i("div",{class:"trunc"},i("div",{class:"cfg-path mono trunc",title:s.source.path??""},s.source.label??"computed"),i("div",{class:"cfg-meta"},i("span",{class:"badge"},io[s.source.kind]),s.trust==="untrusted"?i("span",{class:"badge warn",title:"Not trusted by mise. Read anyway because safe mode cannot run its code."},"untrusted"):null,s.trust==="ignored"?i("span",{class:"badge warn",title:"On mise’s ignore list"},"ignored"):null,s.trust==="trusted"&&s.source.kind!=="global"?i("span",{class:"badge ok"},"trusted"):null),s.tools.length?i("div",{class:"cfg-tools trunc"},s.tools.join(" · ")):null))));return i("section",{class:"tile configs-tile"},co(C.layers,"Config chain",o.length||void 0),r)},ur=(e)=>i("section",{class:"tile foot span-all"},i("div",{class:"foot-row"},i("span",{class:"safe",title:"Every read runs with MISE_SAFE=1 and MISE_AUTO_INSTALL=0. Project [env], [vars], hooks, _.source and path: tools are skipped; templates that need exec() or file reads make mise refuse instead."},q(C.shield),"Safe mode · read-only"),i("span",{class:"mono",title:e.mise.path},`mise ${e.mise.version??"?"}`),e.mise.via==="fallback"?i("span",{class:"chip t-warning",title:`Not on the service PATH; found at ${e.mise.path}`},"found outside PATH"):null,i("span",{class:"grow"}),i("span",{class:"mono"},`${e.elapsedMs} ms`)),i("div",{class:"foot-row"},"Project env, hooks and path: tools are not evaluated, and env values are never read."),i("div",{class:"legend"},...["global","parent","root","local","other"].map((o)=>i("span",null,ct(o),io[o])))),_r=()=>i("div",{class:"bento"},i("div",{class:"tile hero span-all"},i("div",{class:"skel",style:{width:"40px",height:"40px","border-radius":"12px"}}),i("div",{style:{display:"grid",gap:"8px"}},i("div",{class:"skel",style:{width:"45%",height:"16px"}}),i("div",{class:"skel",style:{width:"70%",height:"11px"}})),i("span")),i("div",{class:"tile span-all",style:{height:"64px"}},i("div",{class:"skel",style:{height:"100%"}})),...[150,110,110].map((e)=>i("div",{class:"tile span-all"},i("div",{class:"skel",style:{width:"30%",height:"10px","margin-bottom":"12px"}}),i("div",{class:"skel",style:{height:`${e}px`}})))),vn=(e,o,r,s,...a)=>i("div",{class:`state ${s}`.trim()},i("div",{class:"glyph",html:e}),i("h2",null,o),i("p",null,r),...a),Er=(e)=>vn(e.code==="invalid-scope"?C.folder:C.alert,e.title,e.message,e.code==="invalid-scope"?"":"warn",e.searched?.length?i("details",null,i("summary",null,`Looked in ${e.searched.length} places`),i("pre",{class:"mono"},e.searched.join(`
`))):null,e.code==="invalid-scope"?null:i("button",{class:"btn",on:{click:()=>{at()}}},q(C.refresh),"Try again")),V=()=>{let e=document.activeElement,o=e?.dataset?.focus??null,r=o?[e.selectionStart,e.selectionEnd]:null,s;if(X.kind==="empty")s=vn(C.knife,"No project open","Open a project or worktree and its mise tasks, tools and config show here.","");else if(X.kind==="loading")s=_r();else if(X.kind==="problem")s=Er(X.problem);else{let{data:a}=X;s=i("div",{class:"bento"},rr(a),sr(a),ir(a),lr(a.tasks),dr(a.tools),pr(a.configs),ur(a))}if(st.replaceChildren(i("div",{class:"wrap"},s)),o){let a=st.querySelector(`[data-focus="${o}"]`);if(a){if(a.focus(),r)a.setSelectionRange(r[0],r[1])}}};ne.onReady((e)=>{Wt(e,document.documentElement)});ne.onDirectory((e)=>{if(gn&&e===ve)return;gn=!0,ve=e,ke.clear(),be=!1,Ee="",at()});ne.onServiceEvent((e)=>{if(e.topic!=="pins")return;let o=Ie(),r=e.data?.directory;if(!o||r!==o)return;kn(o).then(V)});var Rn=null;ne.onSessionLifecycle((e)=>{let o=Rn==="started"&&e.phase==="completed";if(Rn=e.phase,o&&ve)at()});V();})();
