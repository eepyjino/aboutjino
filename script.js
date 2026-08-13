/* ================================
   POPUP WINDOWS: open / close / drag
   Works for any number of popups —
   each trigger has data-popup="someId"
   matching a .popup-window with that id.
   ================================ */

document.addEventListener('DOMContentLoaded', function () {

    var triggers = document.querySelectorAll('.popup-trigger');
    var topZIndex = 100;

    triggers.forEach(function (trigger) {
        var popupId = trigger.getAttribute('data-popup');
        var popup = document.getElementById(popupId);
        if (!popup) return;

        var header = popup.querySelector('.popup-header');
        var closeBtn = popup.querySelector('.popup-close');

        /* ---- Open ---- */
        trigger.addEventListener('click', function () {
            popup.style.display = 'block';
            topZIndex += 1;
            popup.style.zIndex = topZIndex;
        });

        /* ---- Close ---- */
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                popup.style.display = 'none';
            });
        }

        /* ---- Bring to front when clicked anywhere on the popup ---- */
        popup.addEventListener('mousedown', function () {
            topZIndex += 1;
            popup.style.zIndex = topZIndex;
        });

        /* ---- Drag (mouse + touch), by the title bar only ---- */
        if (!header) return;

        var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;

        function startDrag(clientX, clientY) {
            isDragging = true;

            var rect = popup.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            // Switch from the initial CSS "top/left" (which can use calc())
            // to plain pixel values once dragging starts, so it tracks the cursor exactly.
            popup.style.left = rect.left + 'px';
            popup.style.top = rect.top + 'px';
        }

        function moveDrag(clientX, clientY) {
            if (!isDragging) return;

            var newLeft = clientX - offsetX;
            var newTop = clientY - offsetY;

            // Keep the popup on-screen (optional — remove these clamps
            // if you want it fully freely draggable off the edges)
            var maxLeft = window.innerWidth - popup.offsetWidth;
            var maxTop = window.innerHeight - popup.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            popup.style.left = newLeft + 'px';
            popup.style.top = newTop + 'px';
        }

        function endDrag() {
            isDragging = false;
        }

        // Mouse events
        header.addEventListener('mousedown', function (e) {
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        });
        document.addEventListener('mousemove', function (e) {
            moveDrag(e.clientX, e.clientY);
        });
        document.addEventListener('mouseup', endDrag);

        // Touch events (mobile/tablet dragging)
        header.addEventListener('touchstart', function (e) {
            var touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });
        document.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            var touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        });
        document.addEventListener('touchend', endDrag);
    });

});