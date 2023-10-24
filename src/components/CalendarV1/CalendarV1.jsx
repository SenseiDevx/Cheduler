import { useState, useEffect, useRef } from 'react';
import * as calendar from './index.jsx';
import styles from './calendarv1.module.css';

function Calendar(props) {
    const { date = new Date(), onChange = Function.prototype } = props;

    const [state, setState] = useState({
        date: date,
        currentDate: new Date(),
        selectedDate: null,
        selectedDates: [], // Список выбранных дат
    });

    const handleDayClick = (date) => {
        let newSelectedDates = [...state.selectedDates]; // Создаем новый массив выбранных дат

        if (newSelectedDates.length === 2) {
            newSelectedDates = []; // Если уже выбраны 2 даты, сбрасываем выбор
        }

        newSelectedDates.push(date); // Добавляем новую дату в массив

        setState({ ...state, selectedDates: newSelectedDates });
        onChange(date);
    };

    const resetSelectedDates = () => {
        setState({ ...state, selectedDates: [] });
    };

    const year = state.date.getFullYear();

    const currentDate = state.currentDate;
    const selectedDate = state.selectedDate;

    const allMonths = [];
    for (let i = 0; i < 12; i++) {
        const monthIndex = (currentDate.getMonth() + i) % 12;
        allMonths.push({
            monthIndex: monthIndex,
            monthData: calendar.getMonthData(year, monthIndex),
            monthName: calendar.getMonthName(monthIndex),
        });
    }

    const scrollableContainerRef = useRef(null);

    useEffect(() => {
        // Находим текущий месяц и определяем его высоту
        const currentMonthIndex = currentDate.getMonth();
        const currentMonthElement = scrollableContainerRef.current.children[currentMonthIndex];
        if (currentMonthElement) {
            const currentMonthHeight = currentMonthElement.getBoundingClientRect().height;
            // Прокручиваем к текущему месяцу
            scrollableContainerRef.current.scrollTop = currentMonthHeight * currentMonthIndex;
        }
    }, [currentDate]);

    return (
        <div className={styles.calendar}>
            <div className={styles.scrollableWrapper}>
                <div ref={scrollableContainerRef} className={styles.scrollableContainer}>
                    {allMonths.map(({ monthIndex, monthData, monthName }) => (
                        <div key={monthIndex} className={styles.monthContainer}>
                            <h2 className={styles.h2}>{monthName} {year}г</h2>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th className={styles.th}>Пн</th>
                                    <th className={styles.th}>Вт</th>
                                    <th className={styles.th}>Ср</th>
                                    <th className={styles.th}>Чт</th>
                                    <th className={styles.th}>Пт</th>
                                    <th className={styles.th}>Сб</th>
                                    <th className={styles.th}>Вс</th>
                                </tr>
                                </thead>
                                <tbody>
                                {monthData.map((week, index) => (
                                    <tr key={index} className="week">
                                        {week.map((date, index) => {
                                            if (date) {
                                                const isCurrentDate = calendar.areEqual(date, currentDate);
                                                const isSelectedDate = state.selectedDates.some((selected) =>
                                                    calendar.areEqual(selected, date)
                                                );

                                                const isBetweenDates =
                                                    state.selectedDates.length === 2 &&
                                                    date > state.selectedDates[0] &&
                                                    date < state.selectedDates[1];

                                                const isDisabled = date < currentDate; // Проверяем, является ли день прошедшим

                                                let dayClassName = styles.notToday;

                                                if (isCurrentDate) {
                                                    dayClassName = styles.today;
                                                } else if (isSelectedDate) {
                                                    dayClassName = styles.selected;
                                                } else if (isBetweenDates) {
                                                    dayClassName = styles.between;
                                                }

                                                return (
                                                    <td
                                                        key={index}
                                                        className={isDisabled ? styles.disabled : dayClassName}
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                handleDayClick(date);
                                                            } else {
                                                                resetSelectedDates(); // Сброс выбранных дат при клике на прошедший день
                                                            }
                                                        }}
                                                    >
                                                        {date.getDate()}
                                                    </td>
                                                );
                                            } else {
                                                return <td key={index} />;
                                            }
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
