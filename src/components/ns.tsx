import * as THREE from "three";
import gsap from "gsap";  
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const Lenis = new Lenis();
    Lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => Lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const header1Split = new SplitText(".header-1 h1", {
        type: "chars",
        charsClass : "char",
    });
    const titleSplits = new SplitText(".tooltip .title h2", {
        type: "lines",
        linesClass: "line",
    });

    const descriptionsplit = new SplitText(".tooltip .description p", {
        type : "lines",
        linesClass : "line",
    });

    header1Split.chars.forEach(
        (char) => (char.innerHTML = '<span>${char.innerHTML}</span>')
    );
    [...titleSplits.lines, ...descriptionsplit.lines].forEach(
        (line) => (line.innerHTML = '<span>${line.innerHTML}</span>')
    );

