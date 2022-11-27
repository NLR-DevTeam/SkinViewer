const { ipcRenderer } = require('electron');

let darkBg = false;

// 创建皮肤预览器
let skinViewer = new skinview3d.SkinViewer({
    canvas: document.getElementById("skinContainer"),
    width: 300,
    height: 400,
    skin: "../assets/defaultSkin.png",
    animation: new skinview3d.IdleAnimation(),
    zoom: 0.8,
    background: "#F5F5F5"
});

// 获取正版玩家皮肤
function getPlayerSkin(username) {
    mdui.snackbar("正在获取...");

    // Get UUID
    fetch("https://api.mojang.com/users/profiles/minecraft/" + username)
        .then(d => { return d.json(); })
        .then(j => {
            // Get Texture
            fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + j.id)
                .then(d => { return d.json(); })
                .then(j => {
                    let skinObject = JSON.parse(Base64.decode(j.properties[0].value)).textures.SKIN;
                    skinViewer.loadSkin(skinObject.url);
                    mdui.snackbar("获取成功!");
                })
                .catch(e => {
                    mdui.snackbar("无法获取玩家皮肤, 请稍后重试!");
                    throw e;
                });
        })
        .catch(e => {
            mdui.snackbar("无法获取玩家 UUID, 请检查玩家是否拥有正版.");
            throw e;
        });
}

// 从本地选取皮肤
function selectSkin() {
    // 初始化选择框
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/png";
    inputElement.style["visibility"] = "hidden";

    // 更改皮肤
    inputElement.onchange = () => {
        let files = inputElement.files;

        if (files == null || files.length == 0) {
            mdui.snackbar("请选择皮肤文件!");
            return;
        }

        let skinFile = files[0];
        skinViewer.loadSkin(skinFile.path);

        mdui.snackbar("加载成功!");
    }

    // 打开选择框
    document.body.appendChild(inputElement);
    inputElement.click();
    inputElement.remove();
}

// 取消右键菜单
window.oncontextmenu = event => {
    event.preventDefault();
};

// 绑定按钮功能
document.getElementById("minimizeBtn").onclick = () => {
    ipcRenderer.send("minimize-request", "");
};

document.getElementById("selectFromLocalBtn").onclick = selectSkin;

document.getElementById("getFromPlayerBtn").onclick = () => {
    mdui.prompt("请输入玩家名",
        "获取正版皮肤",
        input => {
            getPlayerSkin(input);
        },
        () => { },
        {
            confirmText: "获取",
            cancelText: "取消",
            confirmOnEnter: true
        });
};

document.getElementById("changeBackgroundBtn").onclick = () => {
    if (darkBg) {
        skinViewer.background = "#F5F5F5";
        darkBg = false;
        return;
    }

    skinViewer.background = "#212121";
    darkBg = true;
};

document.getElementById("resetBtn").onclick = () => {
    skinViewer.resetCameraPose();
    skinViewer.loadSkin("../assets/defaultSkin.png");
    skinViewer.background = "#F5F5F5";
    darkBg = false;
};

document.getElementById("aboutBtn").onclick = () => {
    new mdui.Dialog("#aboutDialog").open();
};