import { applyCustomCss, applySystemCss } from "./applyCSS.js";
import { TUICData } from "./data.js";
import { TUICI18N } from "./i18n.js";
import { TUICLibrary, TUICPref } from "./library.js";
import { TUICObserver } from "./observer.js";
import { isSafemode } from "./safemode.js";
import { ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ARROW_DOWN, RESET, EMPTY } from "./data/icons.js";

import { inject } from "../shared/options/injectOptions";

export const TUICOptionHTML = {
    displaySetting: function (rootElement) {
        const div = document.createElement("div");
        div.id = "TUICOptionMain";
        rootElement.appendChild(div);
        inject();

        rootElement.querySelector("#css_textarea").value = localStorage.getItem("TUIC_CSS");
        this.eventHandle();
    },
    eventHandle: function (root) {
        if (!root) root = document;
        for (const elem in this.eventList) {
            const listItem = this.eventList[elem];
            if (listItem.single) {
                root.querySelector(elem)?.addEventListener(listItem.type, listItem.function);
            } else {
                for (const elm of root.querySelectorAll(elem)) {
                    elm.addEventListener(listItem.type, listItem.function);
                }
            }
        }
    },
    eventList: {
        ".TUICButtonColor": {
            type: "change",
            function: function (event) {
                const colorAttr = event.target.getAttribute("TUICColor");
                const colorType = event.target.getAttribute("TUICColorType");
                const colorValue = TUICLibrary.color.hex2rgb(event.target.value);
                const colorKind = event.target.getAttribute("TUICColorKind");
                const isChecked = document.getElementById(`${colorAttr}-${colorType}-check`).checked;

                TUICPref.set(`${colorKind}.${colorAttr}.${colorType}`, `rgba(${colorValue[0]}, ${colorValue[1]}, ${colorValue[2]}, ${isChecked ? 0 : 1})`);

                document.getElementById(`${colorAttr}-${colorType}-default`).classList.remove("TUIC_DISPNONE");
                event.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.remove("TUIC_ISNOTDEFAULT");

                TUICPref.save();

                applySystemCss();
            },
            single: false,
        },
        ".TUICButtonColorCheck": {
            type: "click",
            function: function (event) {
                event.target.dataset.checked = event.target.dataset.checked !== "true";

                const colorAttr = event.target.getAttribute("TUICColor");
                const colorType = event.target.getAttribute("TUICColorType");
                const colorValue = TUICLibrary.color.hex2rgb(document.getElementById(`${colorAttr}-${colorType}`).value);
                const colorKind = event.target.getAttribute("TUICColorKind");
                const isChecked = event.target.dataset.checked === "true";

                TUICPref.set(`${colorKind}.${colorAttr}.${colorType}`, `rgba(${colorValue[0]}, ${colorValue[1]}, ${colorValue[2]}, ${isChecked ? 0 : 1})`);

                document.getElementById(`${colorAttr}-${colorType}-default`).classList.remove("TUIC_DISPNONE");
                event.currentTarget.parentElement.parentElement.classList.remove("TUIC_ISNOTDEFAULT");

                TUICPref.save();

                applySystemCss();
            },
            single: false,
        },
        ".TUICDefaultColor": {
            type: "click",
            function: function (event) {
                const colorAttr = event.target.getAttribute("TUICColor");
                const colorType = event.target.getAttribute("TUICColorType");
                const colorKind = event.target.getAttribute("TUICColorKind");
                const TUIC_color = TUICData.colors[colorAttr][colorType].replace("rgba(", "").replace(")", "").split(", ");
                const TUICColor1 = TUICLibrary.color.rgb2hex([Number(TUIC_color[0]), Number(TUIC_color[1]), Number(TUIC_color[2])]);

                document.getElementById(`${colorAttr}-${colorType}`).value = TUICColor1;

                document.getElementById(`${colorAttr}-${colorType}-check`).setAttribute("data-checked", TUIC_color[3] == 0);

                if (TUICPref.get(`${colorKind}.${colorAttr}`) && TUICPref.get(`${colorKind}.${colorAttr}.${colorType}`)) TUICPref.delete(`${colorKind}.${colorAttr}.${colorType}`);

                document.getElementById(`${colorAttr}-${colorType}-check`).parentElement.parentElement.classList.add("TUIC_ISNOTDEFAULT");
                event.currentTarget.classList.add("TUIC_DISPNONE");

                TUICPref.save();

                applySystemCss();
            },
            single: false,
        },
        ".TUICInvisibleItems": {
            type: "click",
            function: function (event) {
                TUICPref.set("invisibleItems." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
            },
            single: false,
        },
        ".TUICXToTwitter": {
            type: "click",
            function: function (event) {
                TUICPref.set("XToTwitter." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
                TUICObserver.titleObserverFunction();
                if (!TUICPref.get("XToTwitter.XtoTwitter") && document.title.endsWith(" / Twitter")) {
                    document.title = document.title.replace(" / Twitter", " / X");
                }
            },
            single: false,
        },
        ".twitterTitle": {
            type: "click",
            function: function (event) {
                TUICPref.set("otherBoolSetting." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
                TUICObserver.titleObserverFunction();
                if (!TUICPref.get("otherBoolSetting.XtoTwitter") && document.title.endsWith(" / Twitter")) {
                    document.title = document.title.replace(" / Twitter", " / X");
                }
            },
            single: false,
        },
        ".otherBoolSetting": {
            type: "click",
            function: function (event) {
                TUICPref.set("otherBoolSetting." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".accountSwitcher": {
            type: "click",
            function: function (event) {
                TUICPref.set("accountSwitcher." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".profileSettingInvisible": {
            type: "click",
            function: function (event) {
                TUICPref.set("profileSetting.invisible." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".profileSettingTabs": {
            type: "click",
            function: function (event) {
                TUICPref.set("profileSetting.tabs." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".tweetDisplaySetting": {
            type: "click",
            function: function (event) {
                TUICPref.set("tweetDisplaySetting." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".sidebarSettingButtonConfig": {
            type: "click",
            function: function (event) {
                TUICPref.set("sidebarSetting.buttonConfig." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".timelineSetting": {
            type: "click",
            function: function (event) {
                TUICPref.set("timeline." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".rightSidebar": {
            type: "click",
            function: function (event) {
                TUICPref.set("rightSidebar." + event.target.id, event.target.checked);
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        "#save": {
            type: "click",
            function: function () {
                localStorage.setItem("TUIC_CSS", document.querySelector("#css_textarea").value);
                applyCustomCss();
            },
            single: true,
        },
        ".default_set": {
            type: "click",
            function: function () {
                localStorage.setItem("TUIC", JSON.stringify(TUICData.defaultPref));
                TUICPref.set("", TUICData.defaultPref);

                if (isSafemode) {
                    location.href = `${location.protocol}//${location.hostname}`;
                } else {
                    document.querySelector("#TUIC_setting").remove();
                    TUICLibrary.getClasses.update();
                    TUICObserver.titleObserverFunction();
                    if (!TUICPref.get("otherBoolSetting.XtoTwitter") && document.title.endsWith(" / Twitter")) {
                        document.title = document.title.replace(" / Twitter", " / X");
                    }
                }
            },
            single: false,
        },
        ".TUIC_up_down_list_to_left": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement;
                const leftBox = parentBox.children[0].children[2];
                const rightBox = parentBox.children[2].children[2];

                const selectedItem = parentBox.getAttribute("TUICSelectedItem");
                if ((selectedItem ?? "") != "") {
                    const selectedItemElem = rightBox.querySelector(`#${selectedItem}`);
                    if (selectedItemElem != null) {
                        leftBox.appendChild(selectedItemElem);
                        TUICOptionHTML.upDownListSetting(parentBox);
                    }
                }
            },
            single: false,
        },
        ".TUIC_up_down_list_to_right": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement;
                const leftBox = parentBox.children[0].children[2];
                const rightBox = parentBox.children[2].children[2];

                const selectedItem = parentBox.getAttribute("TUICSelectedItem");
                if (selectedItem) {
                    const selectedItemElem = leftBox.querySelector(`#${selectedItem}`);
                    if (selectedItemElem != null) {
                        rightBox.appendChild(selectedItemElem);
                        TUICOptionHTML.upDownListSetting(parentBox);
                    }
                }
            },
            single: false,
        },
        ".TUIC_up_down_list_to_up": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement;
                const leftBox = parentBox.children[0].children[2];
                const selectedItem = parentBox.getAttribute("TUICSelectedItem");
                if (selectedItem) {
                    const selectedItemIndex = Array.from(parentBox.querySelectorAll(".TUICUpDownContent")).findIndex((list) => list === leftBox.querySelector(`#${selectedItem}`));

                    if (selectedItemIndex > 0) {
                        leftBox.insertBefore(leftBox.children[selectedItemIndex], leftBox.children[selectedItemIndex - 1]);
                        TUICOptionHTML.upDownListSetting(parentBox);
                    }
                }
            },
            single: false,
        },
        ".TUIC_up_down_list_to_down": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement;
                const leftBox = parentBox.children[0].children[2];
                const selectedItem = parentBox.getAttribute("TUICSelectedItem");
                if (selectedItem) {
                    const selectedItemIndex = Array.from(parentBox.querySelectorAll(".TUICUpDownContent")).findIndex((list) => list === leftBox.querySelector(`#${selectedItem}`));

                    if (selectedItemIndex != -1) {
                        leftBox.insertBefore(leftBox.children[selectedItemIndex], leftBox.children[selectedItemIndex].nextSibling.nextSibling);
                        TUICOptionHTML.upDownListSetting(parentBox);
                    }
                }
            },
            single: false,
        },
        ".TUIC_up_down_list_to_default": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement;
                const leftBox = parentBox.children[0].children[2];
                const rightBox = parentBox.children[2].children[2];

                const settingId = parentBox.getAttribute("TUICUDBox");
                TUICPref.set(settingId, structuredClone(TUICData.defaultPref[settingId]));
                TUICPref.save();
                parentBox.setAttribute("TUICSelectedItem", "");
                const ListItem = TUICOptionHTML.upDownListItem(settingId);
                let listElem;

                listElem = leftBox.children;
                while (listElem.length != 0) {
                    listElem[0].remove();
                }

                listElem = TUICLibrary.HTMLParse(ListItem[0]);
                while (listElem.length != 0) {
                    leftBox.appendChild(listElem[0]);
                }

                listElem = rightBox.children;
                while (listElem.length != 0) {
                    listElem[0].remove();
                }

                listElem = TUICLibrary.HTMLParse(ListItem[1]);
                while (listElem.length != 0) {
                    rightBox.appendChild(listElem[0]);
                }

                TUICOptionHTML.upDownListSetting(parentBox);
                TUICOptionHTML.eventHandle(parentBox);
            },
            single: false,
        },
        ".TUICRadio": {
            type: "change",
            function: function (event) {
                TUICPref.set(event.currentTarget.getAttribute("name"), event.currentTarget.getAttribute("value"));
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".TUICRadio-fixEngagements": {
            type: "change",
            function: function (event) {
                TUICPref.set(event.currentTarget.getAttribute("name"), event.currentTarget.getAttribute("value"));
                TUICPref.save();
                TUICLibrary.getClasses.update();
                TUICObserver.observerFunction();
            },
            single: false,
        },
        ".TUICSelectImg": {
            type: "change",
            function: async function (event) {
                const fileID = event.currentTarget.getAttribute("TUICImgID");
                if (event.currentTarget.files.length >= 1) {
                    await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                            localStorage.setItem(`TUIC_${fileID}`, reader.result);
                            const element = document.createElement("canvas");
                            element.height = 200;
                            element.width = 200;
                            const context = element.getContext("2d");
                            context.beginPath();
                            context.arc(100, 100, 100, (0 * Math.PI) / 180, (360 * Math.PI) / 180);
                            context.clip();
                            const image = new Image();
                            image.onload = function () {
                                context.beginPath();
                                context.drawImage(this, 0, 0, this.naturalHeight, this.naturalWidth, 0, 0, 200, 200);
                                localStorage.setItem(`TUIC_IconImg_Favicon`, element.toDataURL());
                                resolve();
                            };
                            image.src = reader.result;
                        });
                        reader.readAsDataURL(event.currentTarget.files[0]);
                    });
                } else {
                    localStorage.setItem(`TUIC_${fileID}`, "");
                    localStorage.setItem(`TUIC_IconImg_Favicon`, "");
                }

                applySystemCss();
                if (TUICPref.get("twitterIcon") == "custom" && TUICPref.get("otherBoolSetting.faviconSet")) {
                    const imageURL = localStorage.getItem(TUICPref.get("otherBoolSetting.roundIcon") ? "TUIC_IconImg_Favicon" : "TUIC_IconImg");
                    document.querySelector(`[rel="shortcut icon"]`).href = imageURL ?? EMPTY;
                }
            },
            single: false,
        },
        ".TUICUpDownContent": {
            type: "click",
            function: function (event) {
                const parentBox = event.currentTarget.parentElement.parentElement.parentElement;
                const selectedItem = parentBox.getAttribute("TUICSelectedItem");
                if (selectedItem) parentBox.querySelector(`#${selectedItem}`).removeAttribute("TUICSelectedUpDownContent");
                const selectItem = event.currentTarget.id;
                parentBox.querySelector(`#${selectItem}`).setAttribute("TUICSelectedUpDownContent", "true");
                parentBox.setAttribute("TUICSelectedItem", selectItem);
            },
            single: false,
        },
        ".TUICColorSettingRadio": {
            type: "change",
            function: function (event) {
                TUICLibrary.setEditingColorType(event.currentTarget.getAttribute("value"));
                document.querySelector("#TUICColorSettingsDivBox").remove();
                const appendELement = TUICLibrary.HTMLParse(TUICOptionHTML.colorsList()).item(0);
                document.querySelector("#colorSettingList").appendChild(appendELement);
                TUICOptionHTML.eventHandle(appendELement);
            },
            single: false,
        },
        "#TUICExport": {
            type: "click",
            function: function () {
                document.querySelector("#TUICExportBox").value = TUICPref.export();
            },
            single: true,
        },
        "#TUICExportCopy": {
            type: "click",
            function: function () {
                navigator.clipboard.writeText(document.querySelector("#TUICExportBox").value);
            },
            single: true,
        },
        "#TUICImportWrite": {
            type: "click",
            function: function () {
                try {
                    const importPref = JSON.parse(document.querySelector("#TUICImportBox").value);
                    TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                    TUICPref.save();
                    if (isSafemode) {
                        location.href = `${location.protocol}//${location.hostname}`;
                    } else {
                        document.querySelector("#TUIC_setting").remove();
                        TUICLibrary.getClasses.update();
                        applySystemCss();
                        TUICObserver.observerFunction();
                        TUICObserver.titleObserverFunction();
                        if (!TUICPref.get("otherBoolSetting.XtoTwitter") && document.title.endsWith(" / Twitter")) {
                            document.title = document.title.replace(" / Twitter", " / X");
                        }
                    }
                } catch (x) {
                    alert("構文解析に失敗しました");
                }
            },
            single: true,
        },
        "#TUICImportReplace": {
            type: "click",
            function: function () {
                try {
                    const importPref = JSON.parse(document.querySelector("#TUICImportBox").value);
                    TUICPref.set("", TUICLibrary.updatePref.merge(TUICData.defaultPref, importPref));
                    TUICPref.save();
                    if (isSafemode) {
                        location.href = `${location.protocol}//${location.hostname}`;
                    } else {
                        document.querySelector("#TUIC_setting").remove();
                        TUICLibrary.getClasses.update();
                        applySystemCss();
                        TUICObserver.observerFunction();
                        TUICObserver.titleObserverFunction();
                        if (!TUICPref.get("otherBoolSetting.XtoTwitter") && document.title.endsWith(" / Twitter")) {
                            document.title = document.title.replace(" / Twitter", " / X");
                        }
                    }
                } catch (x) {
                    alert("構文解析に失敗しました");
                }
            },
            single: true,
        },
        "#restoreIcon": {
            type: "click",
            function: () => {
                const importPref = {
                    otherBoolSetting: {
                        faviconSet: true,
                    },
                    XToTwitter: {
                        XToTwitter: true,
                        PostToTweet: true,
                    },
                    sidebarSetting: { buttonConfig: { birdGoBackHome: true } },
                    twitterIcon: "twitter",
                };
                TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                TUICPref.save();
                document.querySelector("#TUIC_setting").remove();
                TUICLibrary.getClasses.update();
                applySystemCss();
                TUICObserver.observerFunction();
                TUICObserver.titleObserverFunction();
                if (!TUICPref.get("XToTwitter.XToTwitter") && document.title.endsWith(" / Twitter")) {
                    document.title = document.title.replace(" / Twitter", " / X");
                }
            },
            single: true,
        },
        "#XToTwitterRestoreIcon": {
            type: "click",
            function: () => {
                const importPref = {
                    otherBoolSetting: {
                        faviconSet: true,
                    },
                    sidebarSetting: { buttonConfig: { birdGoBackHome: true } },
                    twitterIcon: "twitter",
                };
                TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                TUICPref.save();
                TUICLibrary.getClasses.update();
                applySystemCss();
                TUICObserver.observerFunction();
                TUICObserver.titleObserverFunction();
                document.querySelector(`#faviconSet`).checked = true;
                document.querySelector(`#twitter`).checked = true;
                if (!TUICPref.get("XToTwitter.XToTwitter") && document.title.endsWith(" / Twitter")) {
                    document.title = document.title.replace(" / Twitter", " / X");
                }
            },
            single: true,
        },
        "#deleteVerified": {
            type: "click",
            function: () => {
                const importPref = {
                    invisibleItems: {
                        verifiedNotifications: true,
                    },
                    profileSetting: {
                        invisible: {
                            "subscribe-profile": true,
                            verifiedFollowerTab: true,
                        },
                    },
                    rightSidebar: {
                        verified: true,
                    },
                    tweetDisplaySetting: {
                        "twitter-pro-promotion-btn": true,
                        "subscribe-tweets": true,
                    },
                };
                TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                TUICPref.set(
                    "sidebarButtons",
                    TUICPref.get("sidebarButtons").filter((elem) => {
                        return elem != "twiter-blue" && elem != "verified-choose";
                    }),
                );
                TUICPref.save();
                document.querySelector("#TUIC_setting").remove();
                TUICLibrary.getClasses.update();
                applySystemCss();
                TUICObserver.observerFunction();
            },
            single: true,
        },
        "#discoverMoreDelete": {
            type: "click",
            function: () => {
                const importPref = {
                    "timeline-discoverMore": "discoverMore_invisible",
                };
                TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                TUICPref.save();
                document.querySelector("#TUIC_setting").remove();
                TUICLibrary.getClasses.update();
                applySystemCss();
                TUICObserver.observerFunction();
            },
            single: true,
        },
        "#defaultTwitterColor": {
            type: "click",
            function: () => {
                const importPref = {
                    buttonColorLight: {
                        "not-following": { background: "rgba(15,20,25,1)", border: "rgba(15,20,25,1)", color: "rgba(255,255,255,1)" },
                        willFollow: { background: "rgba(39,44,48,1)", border: "rgba(39,44,48,1)", color: "rgba(255,255,255,1)" },
                        following: { background: "rgba(255,255,255,0)", border: "rgba(207,217,222,1)", color: "rgba(15,20,25,1)" },
                        "un-following": { border: "rgba(253,201,206,1)", color: "rgba(244,33,46,1)", background: "rgba(244,33,46,0.1)" },
                        profile: { border: "rgba(207,217,222,1)", background: "rgba(255,255,255,0)", color: "rgba(15,20,25,1)" },
                        birthday: { background: "rgba(15,20,25,1)", border: "rgba(15,20,25,1)", color: "rgba(255,255,255,1)" },
                        "profile-save": { background: "rgba(15,20,25,1)", border: "rgba(15,20,25,1)", color: "rgba(255,255,255,1)" },
                        "unsent-tweet": { background: "rgba(15,20,25,1)", border: "rgba(15,20,25,1)", color: "rgba(255,255,255,1)" },
                    },
                    buttonColorDark: {
                        "not-following": { background: "rgba(239,243,244,1)", border: "rgba(239,243,244,1)", color: "rgba(10,20,25,1)" },
                        willFollow: { background: "rgba(215,219,220,1)", border: "rgba(215,219,220,1)", color: "rgba(10,20,25,1)" },
                        following: { background: "rgba(255,255,255,0)", border: "rgba(83,100,113,1)", color: "rgba(239,244,245,1)" },
                        "un-following": { border: "rgba(103,7,15,1)", color: "rgba(244,33,46,1)", background: "rgba(244,33,46,0.1)" },
                        profile: { border: "rgba(83,100,113,1)", background: "rgba(255,255,255,0)", color: "rgba(239,243,244,1)" },
                        birthday: { background: "rgba(239,243,244,1)", border: "rgba(239,243,244,1)", color: "rgba(15,20,25,1)" },
                        "profile-save": { background: "rgba(239,243,244,1)", border: "rgba(239,243,244,1)", color: "rgba(15,20,25,1)" },
                        "unsent-tweet": { background: "rgba(239,243,244,1)", border: "rgba(239,243,244,1)", color: "rgba(15,20,25,1)" },
                    },
                };
                TUICPref.set("", TUICLibrary.updatePref.merge(TUICPref.get(""), importPref));
                TUICPref.save();
                document.querySelector("#TUIC_setting").remove();
                TUICLibrary.getClasses.update();
                applySystemCss();
                TUICObserver.observerFunction();
            },
            single: true,
        },
    },
    upDownListSetting(parentBox) {
        const id = parentBox.getAttribute("TUICUDBox");
        const visible_button_list = [];
        const visibleButtonsT = parentBox.children[0].children[2].querySelectorAll(".TUICUpDownContent");
        for (let i = 0; i < visibleButtonsT.length; i++) {
            visible_button_list.push(visibleButtonsT[i].id);
        }
        TUICPref.set(id, visible_button_list);
        TUICPref.save();
        TUICLibrary.getClasses.update();
        applySystemCss();
    },
    TUICOptionHTML: function () {
        /* eslint-disable indent */
        return `
<div id="TUIC_setting" class="css-1dbjc4n r-1wtj0ep r-ymttw5 r-1f1sjgu r-1e081e0 TUICOriginalContent">
    <div class="css-901oao css-cens5h r-jwli3a r-1tl8opc r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-qvutc0">
        <h2 aria-level="2" role="heading" class="css-4rbku5 css-1dbjc4n r-18u37iz">
            <span class="css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0 TUIC_setting_text">${TUICI18N.get("brandingName")}</span>
        </h2>
    </div>

    <div>
        <br><br>
        <h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_title" style="font-size:18px;margin-bottom:1px;">${TUICI18N.get("settingUI-easySetting")}</h2><br>
        <h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_title" style="font-size:14px;">${TUICI18N.get("settingUI-easySetting-detail")}</h2><br>
        <div class="TUICEasySetting" style="margin-top:15px;">
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" style="margin-top:10px;margin-bottom:10px;" id="restoreIcon">${TUICI18N.get("easySetting-restoreIcon")}</button>
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" style="margin-top:10px;margin-bottom:10px;" id="deleteVerified">${TUICI18N.get("easySetting-deleteVerified")}</button>
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" style="margin-top:10px;margin-bottom:10px;" id="discoverMoreDelete">${TUICI18N.get("easySetting-discoverMoreDelete")}</button>
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" style="margin-top:10px;margin-bottom:10px;" id="defaultTwitterColor">${TUICI18N.get("easySetting-defaultTwitterColor")}</button>
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width default_set" style="margin-top:10px;margin-bottom:10px;">${TUICI18N.get("settingUI-restoreDefaultAll")}</button>
        </div><br>
        <h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_title" style="font-size:18px;">${TUICI18N.get("settingUI-everythingSetting")}</h2>
        <br><br>
        <details class="TUICDetails">
            <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get("settingColors-settingTitle")}</summary>
            <div id="colorSettingList" class="TUIC_col_setting_container">
            <div style="display:flex;">
                <input type="radio" name="TUICColorType" value="buttonColor" id="TUICColorType-Base" class="TUICColorSettingRadio" checked>
                <label class="TUIC_setting_button TUIC_setting_button_width TUICSettingRadioTypeBigButton" for="TUICColorType-Base" style="background: linear-gradient(125deg,#ffffff 0%,#ffffff 42.5%,#000000 42.5%,#000000 100%);"><span><span>${TUICI18N.get(
                    "settingColors-select-base",
                )}</span></span></label>
                <input type="radio" name="TUICColorType" value="buttonColorLight" id="TUICColorType-Light" class="TUICColorSettingRadio">
                <label class="TUIC_setting_button TUIC_setting_button_width TUICSettingRadioTypeBigButton" for="TUICColorType-Light" style="background-color:rgb(255,255,255);"><span><span>${TUICI18N.get("settingColors-select-light")}</span></span></label>
                <input type="radio" name="TUICColorType" value="buttonColorDark" id="TUICColorType-Dark" class="TUICColorSettingRadio">
                <label class="TUIC_setting_button TUIC_setting_button_width TUICSettingRadioTypeBigButton" for="TUICColorType-Dark" style="background-color:rgb(0,0,0);"><span><span>${TUICI18N.get("settingColors-select-dark")}</span></span></label>
            </div>
            <div style="margin-left:10px;margin-right:10px;">
            <span class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text" style="font-size:12px;">${TUICI18N.get("settingColors-select-explain")}</span>
            </div>
            <br>
            ${this.colorsList()}
            </div>
        </details>


${this.upDownList(
    "visibleButtons",
    "bottomTweetButtons-settingTitle-v2",
    `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get("bottomTweetButtons-settingTitle")}</h2>` +
        this.checkbox("bottomScroll", TUICPref.get("tweetDisplaySetting.bottomScroll"), "bottomTweetButtons-setting-visibleScrollBar", "tweetDisplaySetting") +
        this.checkbox("RTNotQuote", TUICPref.get("tweetDisplaySetting.RTNotQuote"), "bottomTweetButtons-setting-RTNotQuote", "tweetDisplaySetting") +
        this.checkbox("noModalbottomTweetButtons", TUICPref.get("tweetDisplaySetting.noModalbottomTweetButtons"), "bottomTweetButtons-setting-noModal", "tweetDisplaySetting") +
        this.checkbox("noNumberBottomTweetButtons", TUICPref.get("tweetDisplaySetting.noNumberBottomTweetButtons"), "bottomTweetButtons-setting-noNumber", "tweetDisplaySetting") +
        this.radioButtonListSub("tweetDisplaySetting.linkCopyURL", "bottomTweetButtons-setting-linkCopyURL", "TUICRadio") +
        this.radioButtonListSub("tweetDisplaySetting.linkShareCopyURL", "bottomTweetButtons-setting-linkShareCopyURL", "TUICRadio") +
        this.radioButtonListSub("timeline-discoverMore", "timeline-discoverMore", "TUICRadio") +
        `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get("fixEngagements-settingTitle")}</h2>` +
        this.upDownListSub("fixEngagements") +
        "<br>" +
        this.checkbox("placeEngagementsLink", TUICPref.get("otherBoolSetting.placeEngagementsLink"), "bottomTweetButtons-setting-placeEngagementsLink", "otherBoolSetting") +
        this.checkbox("placeEngagementsLinkShort", TUICPref.get("otherBoolSetting.placeEngagementsLinkShort"), "fixEngagements-shortName", "otherBoolSetting") +
        `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get("bottomTweetButtons-settingTitle-linkCard")}</h2>` +
        this.checkbox("showLinkCardInfo", TUICPref.get("otherBoolSetting.showLinkCardInfo"), "bottomTweetButtons-setting-showLinkCardInfo", "otherBoolSetting") +
        `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get("invisibleItems-settingTitle")}</h2>` +
        this.checkboxListSub("tweetDisplaySetting", "tweetDisplaySetting"),
)}

${this.radioButtonList(
    "twitterIcon",
    "twitterIcon-settingTitle",
    "TUICRadio",
    "<br>" +
        this.checkbox("faviconSet", TUICPref.get("sidebarSetting.buttonConfig") ?? true, "twitterIcon-favicon", "otherBoolSetting") +
        this.checkbox("roundIcon", TUICPref.get("otherBoolSetting.roundIcon") ?? true, "twitterIcon-roundIcon", "otherBoolSetting") +
        this.uploadImageFile("twitterIcon-usedIcon", "IconImg"),
)}
${this.upDownList(
    "sidebarButtons",
    "sidebarButton-settingTitle",
    this.checkbox("smallerSidebarContent", TUICPref.get("sidebarSetting.buttonConfig.smallerSidebarContent"), "sidebarButton-setting-narrowBetweenButtons", "sidebarSettingButtonConfig") +
        this.checkbox("sidebarNoneScrollbar", TUICPref.get("sidebarSetting.buttonConfig.sidebarNoneScrollbar"), "sidebarButton-setting-sidebarNoneScrollbar", "sidebarSettingButtonConfig") +
        this.checkbox("birdGoBackHome", TUICPref.get("sidebarSetting.buttonConfig.birdGoBackHome"), "sidebarButton-setting-birdGoBackHome", "sidebarSettingButtonConfig") +
        `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get("sidebarButton-accountSwitcher-settingTitle")}</h2>` +
        this.checkbox("icon", TUICPref.get("accountSwitcher.icon"), "sidebarButton-accountSwitcher-Icon", "accountSwitcher") +
        this.checkbox("nameID", TUICPref.get("accountSwitcher.nameID"), "sidebarButton-accountSwitcher-NameID", "accountSwitcher") +
        this.checkbox("moreMenu", TUICPref.get("accountSwitcher.moreMenu"), "sidebarButton-accountSwitcher-MoreMenu", "accountSwitcher"),
)}

<details class="TUICDetails">
<summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get("profileSetting-settingTitle")}</summary>
<div class="TUIC_col_setting_container">
<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${`${TUICI18N.get("profileSetting-tabs-settingTitle")}`}</h2>
 ${this.checkboxListSub("profileSetting.tabs", "profileSettingTabs")}
<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${`${TUICI18N.get("invisibleItems-settingTitle")}`}</h2>
 ${this.checkboxListSub("profileSetting.invisible", "profileSettingInvisible")}
</div>

</details>

${this.checkboxList("invisibleItems", "invisibleItems-settingTitle", "TUICInvisibleItems")}
${this.checkboxList("timeline", "timeline-settingTitle", "timelineSetting")}
${this.checkboxList("XToTwitter", "XToTwitter-settingTitle", "TUICXToTwitter", `<button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" style="margin-bottom:10px;" id="XToTwitterRestoreIcon">${TUICI18N.get("XtoTwitter-twitterIcon")}</button>`)}
${this.checkboxList("rightSidebar", "rightSidebar-settingTitle", "rightSidebar")}
        <br>
        <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width default_set">${TUICI18N.get("settingUI-restoreDefaultAll")}</button>
        <br><br>

        <details class="TUICDetails">
        <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get("customCSS-settingTitle")}</summary>
        <div class="TUIC_col_setting_container">
            <form>
                <textarea id="css_textarea"></textarea>
            </form>
            <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" id="save">${TUICI18N.get("customCSS-save")}</button>
        </div>
        </details>

        <details class="TUICDetails">
            <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get("export-settingTitle")}</summary>
        <div class="TUIC_col_setting_container">
        <input class="TUICTextInput" type="text" id="TUICExportBox" readonly >
            <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" id="TUICExport">${TUICI18N.get("export-exportButton")}</button>
            <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" id="TUICExportCopy">${TUICI18N.get("export-exportButtonCopy")}</button>
        </div>
        </details>

        <details class="TUICDetails">
            <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get("import-settingTitle")}</summary>
        <div class="TUIC_col_setting_container">
        <input class="TUICTextInput" type="text" id="TUICImportBox" >
            <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" id="TUICImportWrite">${TUICI18N.get("import-importAppend")}</button>
            <button class="TUIC_setting_text TUIC_setting_button TUIC_setting_button_width" id="TUICImportReplace">${TUICI18N.get("import-importReplace")}</button>
            <div style="margin-left:10px;margin-right:10px;">
            <span class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text" style="font-size:12px;">${TUICI18N.get("import-select-explain")}</span>
            </div>
        </div>
        </details>
    </div>
</div>

`; /* eslint-enable indent */
    },
    //色の設定の一行(id,type:色のIDと種類。これで判別 color:rgba形式の色,text:色の名前)
    colorSetting: function (id, type, color_, text, isDefault, colorKind) {
        const [color] = [color_.escapeToUseHTML()];
        const TUIC_color = color.replace("rgba(", "").replace(")", "").split(", ");
        const TUICColor1 = TUICLibrary.color.rgb2hex([Number(TUIC_color[0]), Number(TUIC_color[1]), Number(TUIC_color[2])]); /* eslint-disable */
        return `
        <div class="TUIC_setting_color_colmn${!isDefault ? " " + "TUIC_ISNOTDEFAULT" : ""}">
        <h4 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text" style="font-size:18px;">${TUICI18N.get(text)}</h4>
        <div class="TUIC_setting_input_container">
        ${
            TUICData.colors[id]?.ldColor && TUICLibrary.getEditingColorType() == "buttonColor"
                ? `<label class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text" style="font-size:10px;">${TUICI18N.get("settingColors-pleaseLD")}</label><br>`
                : `
            <div class="TUIC_input_color_rounded__container">
                <div class="TUIC_input_color_rounded">
                    <input type="color" id="${id + "-" + type}" TUICColor="${id}" TUICColorType="${type}" value="${TUICColor1}" class="TUICButtonColor" TUICColorKind=${colorKind}>
                    </input>
                </div>
            </div>
            <button type="checkbox" id="${`${id}-${type}-check`}" data-checked="${TUIC_color[3] == "0" ? "true" : "false"}" TUICColor="${id}"
             TUICColorType="${type}" class="TUICButtonColorCheck" TUICColorKind=${colorKind}>
            </button>
            <label for="${`${id}-${type}-check`}" class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text" style="font-size:15px;">${TUICI18N.get("settingUI-colorPicker-transparent")}</label><br>
        `
        }
        </div>
    </div>
    <button class="TUIC_icon_button_con TUIC_setting_button TUIC_setting_button_default TUICDefaultColor${!isDefault ? " " + "TUIC_DISPNONE" : ""}" title="${TUICI18N.get(
        "settingUI-colorPicker-restoreDefault",
    )}" TUICColor="${id}" TUICColorType="${type}" id="${`${id}-${type}-default`}" TUICColorKind="${colorKind}">${RESET}</button>`; /* eslint-enable */
    },
    //色の設定のひとまとまり(id:色のID。種類・色はTUICPrefから自動補完される)
    threeColorSetting: function (id) {
        let returnItem = "";
        if (TUICData.colors[id]["background"]) {
            returnItem += this.colorSetting(id, "background", TUICLibrary.color.getColorFromPref(id, "background", TUICLibrary.getEditingColorType()), "settingUI-colorPicker-background", !!TUICPref.get(TUICLibrary.getEditingColorType())?.[id]?.background, TUICLibrary.getEditingColorType());
        }
        if (TUICData.colors[id]["border"]) {
            returnItem += this.colorSetting(id, "border", TUICLibrary.color.getColorFromPref(id, "border", TUICLibrary.getEditingColorType()), "settingUI-colorPicker-border", !!TUICPref.get(TUICLibrary.getEditingColorType())?.[id]?.border, TUICLibrary.getEditingColorType());
        }
        if (TUICData.colors[id]["color"]) {
            returnItem += this.colorSetting(
                id,
                "color",
                TUICLibrary.color.getColorFromPref(id, "color", TUICLibrary.getEditingColorType()),
                TUICData.colors[id]?.typeColor == "imageColor" ? "settingUI-colorPicker-svgColor" : "settingUI-colorPicker-textColor",
                !!TUICPref.get(TUICLibrary.getEditingColorType())?.[id]?.color,
                TUICLibrary.getEditingColorType(),
            );
        }
        return returnItem;
    },
    //色の設定の全体。forぶん回してる
    colorsList: function () {
        let TUICColors = `<div id="TUICColorSettingsDivBox">`;
        for (const i of TUICData.settings.colors.id) {
            TUICColors += `<h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_title TUIC_setting_text">${TUICI18N.get(TUICData.settings.colors.i18n[i])}</h2>
            <div class="TUIC_col_setting_container_2">${this.threeColorSetting(i, TUICLibrary.getEditingColorType())}
            </div>`;
        }
        TUICColors += "</div>";
        return TUICColors;
    },
    //チェックボックスの一行。(id:設定のid value:Boolで値 name:設定の名前 type:設定の分類)
    checkbox: function (id, value, name, type) {
        return `
        <div class="TUICCheckBoxParent">
            <input id=${id} ${value ? "checked" : ""} type="checkbox" class="${type}"></input>
            <div>
            <label class="TUIC_setting_text" for="${id}">${TUICI18N.get(name)}</label>
            </div>
        </div>
        `;
    },
    //チェックボックスリスト(id:ID title:Stringでタイトル)
    checkboxList: function (id, title, type, otherSetting) {
        const TUICInvisibleCheckBox = this.checkboxListSub(id, type);
        return `
        <details class="TUICDetails">
            <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get(title)}</summary>
          <div class="TUIC_col_setting_container">
              ${TUICInvisibleCheckBox}
          </div>
          <br>
          ${otherSetting ?? ""}
        </details>
          `;
    },
    checkboxListSub: function (id, type) {
        let TUICInvisibleCheckBox = "";
        for (const i of TUICData[id].all) {
            TUICInvisibleCheckBox += this.checkbox(i, TUICPref.get(id)[i], TUICData[id].i18n[i], type);
        }
        return TUICInvisibleCheckBox;
    },
    radioButton: function (id, valueName, value, name, type) {
        return `
        <div class="TUICCheckBoxParent">
                <input type="radio" name="${id}" value="${valueName}" id="${valueName}" class="${type}" ${value ? "checked" : ""}>
                <div>
                <label class="TUIC_setting_text" for="${valueName}">${TUICI18N.get(name)}</label>
                </div>
            </div>
        `;
    },
    radioButtonList: function (id, title, type, option) {
        let TUICInvisibleRadioBox = "";
        for (const i of TUICData[id].all) {
            TUICInvisibleRadioBox += this.radioButton(id, i, TUICPref.get(id) == i, TUICData[id].i18n[i], type);
        }
        return `
        <details class="TUICDetails">
        <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get(title)}</summary>
        <div class="TUIC_col_setting_container">
            ${TUICInvisibleRadioBox}
            ${option}
        </div>
        <br>
        </details>`;
    },
    radioButtonListSub: function (id, title, type) {
        let TUICInvisibleRadioBox = "";
        for (const i of TUICData[id].all) {
            TUICInvisibleRadioBox += this.radioButton(id, i, TUICPref.get(id) == i, TUICData[id].i18n[i], type);
        }
        return `
        <h2 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title TUICSettingSubTitle">${TUICI18N.get(title)}</h2>
        <div>
            ${TUICInvisibleRadioBox}
        </div>
        <br>`;
    },
    iconButton: function (src, btnAction, tooltiptag) {
        return `<button class="TUIC_icon_button_con ${btnAction}" title="${TUICI18N.get(tooltiptag)}">${src}</button>`;
    },
    //アップダウンリスト(id:設定のID。TUICPref直下 title:設定の名前, option:下に表示する設定)
    upDownList: function (id, title, option) {
        /* eslint-disable indent */
        return `
<details class="TUICDetails">
        <summary class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo TUIC_setting_title">${TUICI18N.get(title)}</summary>

        <div class="TUIC_col_setting_container">
        ${this.upDownListSub(id)}
            <br>
            ${option}
        </div>
        <br>
</details>
`;
    },
    upDownListSub: function (id) {
        const UDAllValue = TUICData.settings[id].all;
        const ListItem = this.upDownListItem(id);
        const TUICVisibleButtons = ListItem[0];
        const TUICInvisibleButtons = ListItem[1];
        let contentCount = 5;
        if (UDAllValue.length >= 5) {
            contentCount = UDAllValue.length;
        }
        const UpdownButtonFuncs = [
            {
                iconSrc: ARROW_LEFT,
                btnAction: "TUIC_up_down_list_to_left",
                tooltiptag: "settingUI-upDownList-toLeft",
            },
            {
                iconSrc: ARROW_UP,
                btnAction: "TUIC_up_down_list_to_up",
                tooltiptag: "settingUI-upDownList-toUp",
            },
            {
                iconSrc: ARROW_DOWN,
                btnAction: "TUIC_up_down_list_to_down",
                tooltiptag: "settingUI-upDownList-toDown",
            },
            {
                iconSrc: ARROW_RIGHT,
                btnAction: "TUIC_up_down_list_to_right",
                tooltiptag: "settingUI-upDownList-toRight",
            },
            {
                iconSrc: RESET,
                btnAction: "TUIC_up_down_list_to_default",
                tooltiptag: "settingUI-upDownList-restoreDefault",
            },
        ];
        return `<div style="display:flex;" TUICUDBox="${id}" TUICSelectedItem="">
        <div style="flex: 1 2;width:50px;">
            <h2 style="font-size:15px;" class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text">${TUICI18N.get("settingUI-upDownList-visible")}</h2><br>
            <div id="TUIC_visible" class="TUIC_selectbox" style="--contentCount:${contentCount};">
${TUICVisibleButtons}
            </div>
        </div>
        <div style="text-align: center;width:30px;">
            <br>
            <br>
            ${UpdownButtonFuncs.map((btn) => {
                return this.iconButton(btn.iconSrc, btn.btnAction, btn.tooltiptag);
            }).join("")}
       </div>
        <div style="flex: 1 2;width:50px;">
            <h2 style="font-size:15px;" class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_text">${TUICI18N.get("settingUI-upDownList-invisible")}</h2><br>
            <div id="TUIC_invisible" class="TUIC_selectbox" style="--contentCount:${contentCount};">
${TUICInvisibleButtons}
            </div>
        </div>
    </div>`;
    } /* eslint-enable indent */,
    //アップダウンリストの内容(id:設定のID)
    upDownListItem: function (id) {
        let TUICVisibleButtons = "";
        let TUICInvisibleButtons = "";
        for (const i of TUICPref.get(id)) {
            TUICVisibleButtons += `<div value="${i}" id="${i}" class="TUICUpDownContent"><span>${TUICI18N.get(TUICData.settings[id].i18n[i])}</span></div>`;
        }
        for (const i of TUICData.settings[id].all) {
            if (!TUICPref.get(id).includes(i)) {
                TUICInvisibleButtons += `<div value="${i}" id="${i}" class="TUICUpDownContent"><span>${TUICI18N.get(TUICData.settings[id].i18n[i])}</span></div>`;
            }
        }
        return [TUICVisibleButtons, TUICInvisibleButtons];
    },
    uploadImageFile: function (title, id) {
        return `<h3 class="r-jwli3a r-1tl8opc r-qvutc0 r-bcqeeo css-901oao TUIC_setting_title">${TUICI18N.get(title)}</h3><br>
        <input type="file" accept="image/*" class="TUIC_setting_text TUICSelectImg" TUICImgID="${id}" />
        <p class="TUIC_setting_text">${TUICI18N.get("twitterIcon-nowIcon")}</p>
        <span id="TUICIcon_${id}" class="TUICUploadedImg">`;
    },
};
