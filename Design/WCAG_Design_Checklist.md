# WCAG checklist — for when I design

This is for **accessibility** (can people actually use the site — zoom, contrast, keyboard, etc.).  
Our colours and button roundness are in **[Design_Agreement.md](Design_Agreement.md)**.

School / client usually wants **WCAG 2.2 AA**. I go through this before we build.

---

**Text**

- [ ] Not too small  
- [ ] Still ok at **200%** browser zoom  
- [ ] Line spacing ok, not squashed  
- [ ] Important stuff is real text, not baked into a JPG  
- [ ] Headings make sense in order (H1 then H2…), not random big text  

---

**Colour**

- [ ] Checked normal text vs background (~**4.5:1** on a contrast website)  
- [ ] Big bold text can be a bit lower (~**3:1**)  
- [ ] Don’t explain things with colour only (e.g. error needs text or icon too)  
- WebAIM or a Figma plugin is fine for checking  

---

**Buttons & links**

- [ ] Tap/click area at least **24×24px** (we use **44px** height anyway in our design doc)  
- [ ] Not too cramped next to each other  
- [ ] Links say what they do, not “click here”  
- [ ] Icon-only? I write what the screen reader label should be for the dev  

---

**Forms**

- [ ] Real label visible, not only grey text inside the input  
- [ ] Required fields obvious (word or * + explanation)  
- [ ] I showed how errors look + space for a short message  
- [ ] Tab order same as reading order  

---

**Keyboard**

- [ ] Focus visible (outline / ring — we said olive in the design agreement)  
- [ ] Popups closable, you don’t get trapped  
- [ ] If we add flashy animation, devs turn it down for “prefers reduced motion”  

---

**Images**

- [ ] Important pics: I noted alt text (or “decorative, no alt”)  
- [ ] Video later → captions if the assignment needs it  

---

**Phone**

- [ ] Works on a narrow screen without sideways scroll for the main text  
- [ ] Hover menus / tooltips: you can move the mouse to them without them disappearing  

---

Official docs if the teacher asks: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [quick reference](https://www.w3.org/WAI/WCAG22/quickref/)

GreenEarth Produce — Preslav / team
