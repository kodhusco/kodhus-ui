import Utils from './utils';
import Dialog from "./dialog";
import Notification from "./notification";
import Navigation from "./navigation";
import SideNavigation from "./side-navigation";
import Dropdown from "./dropdown";
import Aiv from "./aiv";
import BGParallax from "./bg-parallax";
import Carousel from "./carousel";
import KScroll from "./scroll-story";
import Tab from "./tab";
import StepProgressBar from "./step-progressbar";
import Autocomplete from "./autocomplete";
import Button from "./button";

(() => {
  document.querySelectorAll("pre code").forEach((block) => {
    if (typeof hljs !== 'undefined') {
      hljs.highlightBlock(block);
    }
  });
})();

export {
  Utils,
  Dialog,
  Notification,
  Navigation,
  SideNavigation,
  Aiv,
  BGParallax,
  Carousel,
  KScroll,
  Tab,
  StepProgressBar,
  Autocomplete,
  Dropdown,
  Button,
};
