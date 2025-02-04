const observer = new MutationObserver(() => {
  const tui = document.querySelector('.t-textfield');
  const courseList = document.querySelector('.course-list');

  if (tui && courseList) {
      // Создаем кнопку "Скрыть курс", если её нет
      if (!document.querySelector('.hide__btn')) {
          const btn = document.createElement('button');
          btn.classList.add('hide__btn');
          btn.textContent = "Скрыть курс";
          btn.addEventListener('click', toggleHideMode);
          tui.appendChild(btn);
      }

      // Восстанавливаем состояние скрытых курсов
      chrome.storage.sync.get("hiddenCourses", function (data) {
          let hiddenCourses = data.hiddenCourses || [];

          const courses = courseList.childNodes;
          for (let course of courses) {
              if (course.tagName === 'LI') {
                  // Добавляем кнопку-крестик (если её нет)
                  if (!course.querySelector('.item__back-btn')) {
                      const back = document.createElement('button');
                      back.classList.add('item__back-btn');
                      back.textContent = "X";
                      back.addEventListener('click', toggleCourseVisibility);
                      course.appendChild(back);
                  }

                  // Если курс был скрыт ранее, делаем его полупрозрачным и меняем крестик на "+"
                  const courseId = course.textContent.trim();
                  if (hiddenCourses.includes(courseId)) {
                      course.classList.add('hidden-course');
                      course.querySelector('.item__back-btn').textContent = "+";
                  }
              }
          }
      });

      observer.disconnect(); // Останавливаем наблюдение после вставки элементов
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function toggleHideMode() {
  const btn = document.querySelector('.hide__btn');
  const courseList = document.querySelectorAll('.course-list li');

  if (!btn || !courseList.length) return;

  let isActive = btn.classList.contains('active_btn');

  if (isActive) {
      // Выключаем режим скрытия
      btn.classList.remove('active_btn');
      courseList.forEach(course => {
          course.classList.replace('hidden-course-active', 'hidden-course');
          course.classList.remove('course-active');
          const crossBtn = course.querySelector('.item__back-btn');
          if (crossBtn) crossBtn.style.display = "none"; // Прячем крестики
      });
  } else {
      // Включаем режим скрытия
      btn.classList.add('active_btn');
      courseList.forEach(course => {
          course.classList.replace('hidden-course', 'hidden-course-active');
          course.classList.add('course-active');
          const crossBtn = course.querySelector('.item__back-btn');
          if (crossBtn) crossBtn.style.display = "inline-block"; // Показываем крестики
      });
  }
}


// Функция скрытия/показа конкретного курса
function toggleCourseVisibility() {
  let course = this.parentElement;
  let courseId = course.textContent.trim();
  
  chrome.storage.sync.get("hiddenCourses", function (data) {
      let hiddenCourses = data.hiddenCourses || [];

      if (hiddenCourses.includes(courseId)) {
          // Если курс уже скрыт – показываем его обратно
          hiddenCourses = hiddenCourses.filter(id => id !== courseId);
          course.classList.remove('hidden-course-active');
          course.querySelector('.item__back-btn').textContent = "X";
      } else {
          // Скрываем курс
          hiddenCourses.push(courseId);
          course.classList.add('hidden-course-active');
          course.querySelector('.item__back-btn').textContent = "+";
      }

      // Обновляем хранилище
      chrome.storage.sync.set({ hiddenCourses: hiddenCourses });
  });
}


// Применяем CSS
chrome.storage.local.get('userCss', (data) => {
  if (data.userCss) {
    const styleElement = document.createElement('style');
    styleElement.textContent = data.userCss;
    document.head.appendChild(styleElement);
  }
});
