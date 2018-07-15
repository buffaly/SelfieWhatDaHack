var canvas_2d;
var loading_first_time = false;

var selected_object = null;
// history undo redo
var state;
var undo = [];
var redo = [];
var img = new Image();

function ini_canvas_2d(backgroundImage) {
    canvas_2d = new fabric.Canvas('canvas-2d');
    canvas_2d.backgroundColor = '#eee';
    img.crossOrigin = "anonymous";
    img.src = backgroundImage;
    img.onload = function(){
        var imageRadio = img.width / img.height;
        var bgImgWidth = window.innerWidth;
        var bgImgHeight = window.innerWidth / imageRadio;
        if (bgImgHeight > window.innerHeight - 200) {
            bgImgHeight = window.innerHeight - 200;
            bgImgWidth = bgImgHeight * imageRadio;
        }
        $('.custom-box').width(bgImgWidth);
        $('.custom-box').height(bgImgHeight);
        // canvas_2d.setOverlayImage('/images/creadit.png', canvas_2d.renderAll.bind(canvas_2d), {
        //     overlayImageRight: 0,
        //     overlayImageBottom: 0
        // });

        canvas_2d.setOverlayImage('/images/creadit.png', function() {
            canvas_2d.overlayImage.width = canvas_2d.width  / 4;
            canvas_2d.overlayImage.height = canvas_2d.width  / 4;
            canvas_2d.overlayImage.top = canvas_2d.height - (canvas_2d.width  / 4);
            canvas_2d.overlayImage.left = canvas_2d.width - (canvas_2d.width  / 4);
            console.log('canvas_2d.overlayImage', canvas_2d.overlayImage);
            canvas_2d.renderAll();
        });

        canvas_2d.setBackgroundImage(new fabric.Image(img, {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: bgImgWidth,
            height: bgImgHeight,
        }), canvas_2d.renderAll.bind(canvas_2d));

        
    };

    canvas_2d.on('after:render', changeTexture);
    canvas_2d.on('object:modified', save);
    canvas_2d.on('object:added', save);

    canvas_2d.on('object:selected', onObjectSelected);

    

    save();
}

function onObjectSelected(e) {
  selected_object = e.target;
  selected_object.set({
    borderColor: '#AC6CBD',
    cornerColor: '#AC6CBD',
    cornerSize: 20,
    transparentCorners: false,
    cornerStyle: 'circle'
  });

  selected_object.setControlsVisibility({
    tr: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
    mtr: true
  });
}



function insertImgWithUrl(url) {

    fabric.Image.fromURL(url, function(imgInsert) {
        var scaleSize = canvas_2d.width / imgInsert.width * 0.3;
        imgInsert.set({
            scaleX: scaleSize,
            scaleY: scaleSize,
            left: canvas_2d.width / 3,
            top: canvas_2d.height / 3
        })
        canvas_2d.add(imgInsert);
    }, { crossOrigin: 'anonymous' });

}


// var imageLoader = document.getElementById('imageLoader');
// imageLoader.addEventListener('change', handleImage, false);

// function handleImage(e) {
//   var reader = new FileReader();
//   reader.onload = function(event) {
//     var img = new Image();
//     img.onload = function() {
//       var imgInstance = new fabric.Image(img, {
//         scaleX: 0.1,
//         scaleY: 0.1
//       })
//       canvas_2d.add(imgInstance);
//     }
//     img.src = event.target.result;
//   }
//   reader.readAsDataURL(e.target.files[0]);
// }




window.deleteObject = function() {
    if (canvas_2d.getActiveObject()) {
        canvas_2d.getActiveObject().remove();
    } else {
        $('#alert-select-img').click();
    }
}

function onWindowResize() {
    var imageRadio = img.width / img.height;
    var bgImgWidth = window.innerWidth;
    var bgImgHeight = window.innerWidth / imageRadio;
    if (bgImgHeight > window.innerHeight - 200) {
        bgImgHeight = window.innerHeight - 200;
        bgImgWidth = bgImgHeight * imageRadio;
    }
    $('.custom-box').width(bgImgWidth);
    $('.custom-box').height(bgImgHeight);
    canvas_2d.setBackgroundImage(new fabric.Image(img, {
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: bgImgWidth,
        height: bgImgHeight,
    }), canvas_2d.renderAll.bind(canvas_2d));

    canvas_2d.setHeight(bgImgHeight);
    canvas_2d.setWidth(bgImgWidth);
    canvas_2d.renderAll.bind(canvas_2d), {
        backgroundImageOpacity: 0.5,
        width: bgImgWidth,
        height: bgImgHeight,
    }
}


var timeoutInCase = {};

function changeTexture() {
    if (!loading_first_time) {
        // addImageFirstTime();
        loading_first_time = true;
        setTimeout(save, 500);
        onWindowResize();
        window.addEventListener('resize', onWindowResize, false);
    }
}


function debounce(func, wait, immediate, key) {
    var context = this;
    var args = arguments;
    var callNow = immediate && !timeoutInCase[key];
    clearTimeout(timeoutInCase[key]);
    timeoutInCase[key] = setTimeout(function() {
        timeoutInCase[key] = null;
        if (!immediate) {
            func.apply(context, args);
        }
    }, wait);
    if (callNow) func.apply(context, args);
}





function insert_shape() {
    var color = $('#colorSelector > .diy-color-box').css('backgroundColor');
    var object_to_insert;
    var size = canvas_2d.height / 4;

    switch ($('#select_shape').val()) {
        case 'cicle':
            object_to_insert = new fabric.Circle({ radius: size / 2, fill: color, left: canvas_2d.width / 3, top: canvas_2d.height / 3 });
            break;
        case 'triangle':
            object_to_insert = new fabric.Triangle({ width: size, height: size, fill: color, left: canvas_2d.width / 3, top: canvas_2d.height / 3 });
            break
        case 'line':
            object_to_insert = new fabric.Rect({ width: size * 2, height: 10, fill: color, left: canvas_2d.width / 4, top: canvas_2d.height / 2 });
            break
        case 'square':
            object_to_insert = new fabric.Rect({ width: size, height: size, fill: color, left: canvas_2d.width / 3, top: canvas_2d.height / 3 });
            break
    }
    object_to_insert.opacity = $("#opacity_shape").val() == 0 ? 0.1 : $("#opacity_shape").val();

    canvas_2d.add(object_to_insert);
}

function insert_text() {
    var color = $('#colorSelectorText > .diy-color-box').css('backgroundColor');
    var text = $('#input_text_insert').val();
    var font_family = $('#select_text_insert').val();
    var size = 40;
    var text = new fabric.Text(text, { fill: color, fontFamily: font_family, fontSize: size, left: canvas_2d.width / 4, top: canvas_2d.height / 2 });
    text.opacity = $("#opacity_text").val() == 0 ? 0.1 : $("#opacity_text").val();
    canvas_2d.add(text);
}


document.getElementById('lnkDownload').addEventListener('click', function() {

    var dataURL = canvas_2d.toDataURL({
        format: 'jpeg',
        quality: 0.8
      });

    var url = dataURL.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
    window.open(url);

}, false);

var downloadCanvas = function(link, filename) {
var dURL = canvas_2d.toDataURL({
format: 'png',
multiplier: 1
})
link.href = dURL;
link.download = filename;
};

// fabric.Image.prototype.getSvgSrc = function() {
//     return this.toDataURLforSVG();
// };

// fabric.Image.prototype.toDataURLforSVG = function(options) {
//     var el = fabric.util.createCanvasElement();
//     el.width = this._element.naturalWidth;
//     el.height = this._element.naturalHeight;
//     el.getContext("2d").drawImage(this._element, 0, 0);
//     var data = el.toDataURL(options);
//     return data;
// };

function export_2d_json() {
    return JSON.stringify(canvas_2d.toJSON());
}

function clone_obj() {

    var activeObject = canvas_2d.getActiveObject(),
        activeGroup = canvas_2d.getActiveGroup();

    var _clipboard = null;

    if (activeGroup) {
        _clipboard = activeGroup;
    } else if (activeObject) {
        _clipboard = activeObject;
    }

    var activeObject = canvas_2d.getActiveObject(),
        activeGroup = canvas_2d.getActiveGroup();
    canvas_2d.discardActiveObject();
    if (_clipboard.size) {

        _clipboard.clone(function(clonedObj) {
            canvas_2d.discardActiveGroup();
            clonedObj.set({
                left: clonedObj.left + 8,
                top: clonedObj.top + 8,
                evented: true
            });

            clonedObj.forEachObject(function(obj) {
                obj.set('active', true);
                canvas_2d.add(obj);
            });

            canvas_2d.setActiveGroup(clonedObj).renderAll();
        });
    } else {
        _clipboard.clone(function(clonedObj) {
            clonedObj
                .set("top", _clipboard.top + 5)
                .set("left", _clipboard.left + 5)
                .setCoords();

            canvas_2d
                .add(clonedObj)
                .setActiveObject(clonedObj)
                .renderAll();
        });
    }
}

function bring_front() {
    canvas_2d.bringToFront(canvas_2d.getActiveObject());
    canvas_2d.deactivateAll().renderAll();
}

function send_back() {
    canvas_2d.sendToBack(canvas_2d.getActiveObject());
    canvas_2d.deactivateAll().renderAll();
}



// undo redo
var canUndo = false;
var canRedo = false;

function save() {
    redo = [];
    canRedo = false;
    if (state) {
        undo.push(state);
        canUndo = true;
    }
    state = JSON.stringify(canvas_2d);

}

function replay(playStack, saveStack, buttonsOn, buttonsOff) {
    saveStack.push(state);
    state = playStack.pop();
    console.log(JSON.parse(state));
    buttonsOn = false;
    buttonsOff = false;
    canvas_2d.clear();
    canvas_2d.loadFromJSON(state, function() {
        canvas_2d.renderAll();
        buttonsOn = true;
        if (playStack.length) {
            buttonsOff = true;
        }
        canvas_2d.backgroundColor = canvas_2d.backgroundColor;
        onWindowResize();
    });
}


document.onkeydown = function(event) {
    var key;
    if (window.event) {
        key = window.event.keyCode;
    } else {
        key = event.keyCode;
    }

    switch (key) {
        // case 89: // Ctrl+Y
        //     if (canRedo) {
        //         replay(redo, undo, canUndo, canRedo);
        //     }
        //     break;
        // case 90: // Ctrl+Z
        //     if (canUndo) {
        //         replay(undo, redo, canRedo, canUndo);
        //     }
        //     break;
        case 67: // Ctrl+C
            clone_obj();
            break;
        case 46: // delete
            canvas_2d.getActiveObject().remove();
        default:
            break;
    }
}