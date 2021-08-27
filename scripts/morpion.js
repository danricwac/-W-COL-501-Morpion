$(document).ready(function () {
    $.fn.morpion = function (options = {}) {
        options = $.extend({}, { replayButton: '#replay' }, options);
        const self = this;
        const rows = $(this).find('.row');
        const cells = $(this).find('.cell');
        const winnerDisplay = $(this).find('.win-display');

        const replay = $(options.replayButton);
        let currentPlayer = 1;
        $(rows).each(function (y, row) {
            $(row)
                .find('.cell')
                .each(function (x, cell) {
                    $(cell).data('y', y);
                    $(cell).data('x', x);
                });
        });

        $(replay).click(function () {
            $(cells).each(function (_, cell) {
                $(cell).removeData('player');
                $(cell).text('');
            });

            $(self).removeClass('won');
        });

        /**
         * @param x
         * @param y
         * @param dx
         * @param dy
         */
        function checkLine(x, y, dx, dy) {
            let current = null;

            for (let i = 0; i < 3; i++) {
                const cell = cells[y * 3 + x];

                if (current === null) {
                    current = $(cell).data('player');
                }

                if ($(cell).data('player') !== current) {
                    return null;
                }

                x += dx;
                y += dy;
            }

            return current;
        }
        function checkWin(cell) {
            const x = $(cell).data('x');
            const y = $(cell).data('y');

            const result =
                checkLine(x, 0, 0, 1) ||//Vertical
                checkLine(0, y, 1, 0) ||//Horizontal
                checkLine(0, 0, 1, 1) ||//Diagonal Right
                checkLine(2, 0, -1, 1);//Diagonal Left

            if (result) {
                $(winnerDisplay).text(`Player ${result} wins!`);
                $(self).addClass('won');
            }

            return result;
        }

        function checkFull() {
            for (let i = 0; i < $(cells).length; i++) {
                if (!$(cells[i]).data('player')) return false;
            }

            return true;
        }

        $(cells).click(function () {
            if ($(this).data('player')) return;

            $(this).text(currentPlayer === 1 ? 'X' : 'O');
            $(this).data('player', currentPlayer);

            currentPlayer = currentPlayer === 1 ? 2 : 1;

            if (!checkWin(this) && checkFull()) {
                $(winnerDisplay).text('Draw');
                $(self).addClass('won');
            }
        });
    };
    $('#grid').morpion({ replayButton: '#replay' });
});