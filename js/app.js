


/* STUDENT APPLICATION */
$(function() {
    var model = {
        /* STUDENTS IGNORE THIS FUNCTION
         * All this does is create an initial
         * attendance record if one is not found
         * within localStorage.
         */
        init: function() {
            if (!localStorage.attendance) {
                console.log('Creating attendance records...');
                function getRandom() {
                    return (Math.random() >= 0.5);
                }

                var names = ["Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda"];
                var attendance = {};

                for (var i = 0; i < names.length; i++) {
                    attendance[names[i]] = [];

                    for (var j = 0; j <= 11; j++) {
                        attendance[names[i]].push(getRandom());
                    }
                }

                localStorage.attendance = JSON.stringify(attendance);
            }
        },
        add: function(obj) {

        },
        getAttendance: function() {
            return JSON.parse(localStorage.attendance);
        },
        saveAttendance: function(newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        }
    };

    var octopus = {
        init: function() {
            model.init();
            view.init();
        },
        getAttendance: function() {
            return model.getAttendance();
        },
        saveAttendance: function(newAttendance) {
            model.saveAttendance(newAttendance);
        }
    };

    var view = {
        init: function() {
            view.render();
            view.stuff();
        },
        render: function() {
            var attendance = octopus.getAttendance();
            var numDays = attendance[Object.keys(attendance)[0]].length;
            var students = Object.keys(attendance);
            var tbody = document.getElementById('students');

            for (var student in students) {
                var tr = document.createElement('tr');
                tr.className = 'student';

                //add name col <td class="name-col">Slappy the Frog</td>
                var nametd = document.createElement('td');
                nametd.className = 'name-col';
                nametd.textContent = students[student];
                tr.appendChild(nametd);

                for (var i = 0; i < numDays; i ++) {
                    //create <td class="attend-col"><input type="checkbox"></td>
                    var td = document.createElement('td');
                    td.className = 'attend-col';

                    var input = document.createElement('input');
                    input.type = 'checkbox';
                    td.appendChild(input);

                    tr.appendChild(td);
                }
                // add missed col <td class="missed-col">0</td>
                var missedtd = document.createElement('td');
                missedtd.className = 'missed-col';
                tr.appendChild(missedtd);

                tbody.appendChild(tr);
            }

        },
        stuff: function() {
            var attendance = octopus.getAttendance(),
                $allMissed = $('tbody .missed-col'),
                $allCheckboxes = $('tbody input');

            // Count a student's missed days
            function countMissing() {
                $allMissed.each(function() {
                    var studentRow = $(this).parent('tr'),
                        dayChecks = $(studentRow).children('td').children('input'),
                        numMissed = 0;

                    dayChecks.each(function() {
                        if (!$(this).prop('checked')) {
                            numMissed++;
                        }
                    });

                    $(this).text(numMissed);
                });
            }

            // Check boxes, based on attendace records
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });

            // When a checkbox is clicked, update localStorage
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                countMissing();
                //save new data to attendance
                octopus.saveAttendance(newAttendance);
            });

            countMissing();
        }

    };

    octopus.init();
});
