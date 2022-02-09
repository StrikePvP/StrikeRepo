function redirect(page){
    window.location.href = "/"+page;
}

function copy(text){
    var dummy = document.createElement("textarea")
    document.body.appendChild(dummy)
    dummy.value = text
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy);
}