if (document.getElementById("react-root") != null && window.location.pathname == "/tuic/safemode") {
    if (document.querySelector("#safemode") == null) {
        document.querySelector("#react-root").style = "display:none !important;"
        let safemode = document.createElement("div")
        safemode.id = "safemode"
        safemode.style = "height:100%;width:100%"
        document.querySelector("body").appendChild(safemode)
        if (document.querySelector(".twitter_ui_customizer_css") != null) {
            document.querySelector(".twitter_ui_customizer_css").remove()
        }
        let setTitle = ()=>{
            document.title = TUICLibrary.getI18n("safemode-title")
            window.setTimeout(setTitle,5000)
        }
        setTitle()
        TUICOptionHTML.displaySetting(document.querySelector('#safemode'))
    }
}