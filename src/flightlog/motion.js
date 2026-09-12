import Lenis from 'lenis';
export const clamp01=n=>Math.min(1,Math.max(0,n));
export const ease=n=>{n=clamp01(n);return n*n*(3-2*n);};
export const damp=(current,target,rate,dt)=>current+(target-current)*(1-Math.exp(-rate*dt));
const dialogs=new WeakMap();
let viewTransition;
/** Wheel inertia and WebGL share the caller's RAF. Touch stays native. */
export function scrollDriver(enabled,wake){
 const fine=matchMedia('(pointer:fine)').matches;
 const lenis=enabled&&fine?new Lenis({autoRaf:false,lerp:.105,smoothWheel:true,syncTouch:false,overscroll:true,prevent:node=>node instanceof Element&&!!node.closest('dialog,[data-native-scroll]')}):null;
 lenis?.on('virtual-scroll',wake);lenis?.on('scroll',wake);
 return {raf:t=>lenis?.raf(t),get active(){return lenis?.isScrolling==='smooth';},resize:()=>lenis?.resize(),to(target){if(lenis){lenis.start();lenis.scrollTo(target,{offset:-20,duration:1.08,easing:t=>1-Math.pow(1-t,4),onComplete:wake});wake();}else target.scrollIntoView({behavior:enabled?'smooth':'instant',block:'start'});},sync:()=>lenis?.scrollTo(window.scrollY,{immediate:true,force:true}),lock(value){if(value)lenis?.stop();else lenis?.start();},destroy:()=>lenis?.destroy()};
}
export function animateIn(dialog,enabled){
 const old=dialogs.get(dialog);old?.animation?.cancel();dialogs.delete(dialog);
 dialog.classList.remove('closing');if(!dialog.open)dialog.showModal();
 if(!enabled)return;
 const menu=dialog.id==='menu-dialog';
 const keyframes=menu?[{clipPath:'inset(0 0 100% 0)',opacity:1},{clipPath:'inset(0 0 0% 0)',opacity:1}]:[{opacity:0,transform:'translateY(26px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}];
 const animation=dialog.animate(keyframes,{duration:menu?620:420,easing:'cubic-bezier(.22,1,.36,1)'});dialogs.set(dialog,{animation});
}
export function animateOut(dialog,enabled,done,immediate=false){
 const old=dialogs.get(dialog);if(old?.closing&&!immediate)return;
 old?.animation?.cancel();
 if(!dialog.open||!enabled||immediate){dialogs.delete(dialog);dialog.close();done?.();return;}
 const token={closing:true};dialogs.set(dialog,token);dialog.classList.add('closing');
 const menu=dialog.id==='menu-dialog';
 token.animation=dialog.animate(menu?[{clipPath:'inset(0 0 0% 0)'},{clipPath:'inset(0 0 100% 0)'}]:[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(14px) scale(.99)'}],{duration:menu?360:230,easing:'cubic-bezier(.55,0,.8,.3)',fill:'forwards'});
 token.animation.finished.then(()=>{if(dialogs.get(dialog)!==token)return;dialog.close();dialog.classList.remove('closing');token.animation.cancel();dialogs.delete(dialog);done?.();}).catch(()=>{});
}
export function crossfade(update,enabled){
 if(!enabled||!document.startViewTransition){update();return;}
 viewTransition?.skipTransition();viewTransition=document.startViewTransition(update);
 viewTransition.finished.finally(()=>{viewTransition=null;}).catch(()=>{});
}
