function onMouseClick(evt) {
	evt.preventDefault();
	var array = getMousePosition(raycastContainer, evt.clientX, evt.clientY);
	onClickPosition.fromArray(array);
	var intersects = getIntersects(onClickPosition, object.children);
	console.log(intersects);
	if (intersects.length > 0 && intersects[0].uv) {
	  var uv = intersects[0].uv;
	  console.log(uv.x * 512);
	  console.log(uv.y * 512);
	  intersects[0].object.material.map.transformUv(uv);
	  var selected = getObjectUnderPoint(uv);
	  if (selected != null) {
		  console.log(selected);
		controls.enabled = false;
		canvas.setActiveObject(selected);
		canvas.renderAll();
	  } else {
		  canvas.discardActiveObject().renderAll();
		controls.enabled = true;
	  }
	} else {
	  controls.enabled = true;
	}
  }
  
  function getRealPosition(axis, value) {
	let CORRECTION_VALUE = axis === "x" ? 4.5 : 5.5;
	return Math.round(value * 512) - CORRECTION_VALUE;
  }
  
  var getMousePosition = function (dom, x, y) {
	var rect = dom.getBoundingClientRect();
	return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  };
  
  var getIntersects = function (point, objects) {
	mouse.set(point.x * 2 - 0.97, -(point.y * 2) + 0.97);
	raycaster.setFromCamera(mouse, camera);
	return raycaster.intersectObjects(objects);
  };
  var getObjectUnderPoint = function (uv) {
	var cp = { x: uv.x * 512, y: uv.y * 512 };
	var objects = canvas.getObjects();
	for (var i = 0; i < objects.length; i++) {
	  var obj = objects[i];
	  if (!canvas.containsPoint(null, obj, cp)) continue;
	  var isIntersecting = canvas.isTargetTransparent(obj, cp.x, cp.y);
	  if (isIntersecting) {
		return obj;
	  }
	}
	return null;
  };