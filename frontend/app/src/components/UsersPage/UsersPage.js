import React, { useState } from "react";
import Sidebar from "../HomePage/Sidebar";
import "./users.css";

const avatarList = [
  "/avatar/user1.jpg",
  "/avatar/user2.jpg",
  "/avatar/user3.jpg",
  "/avatar/user4.jpg",
  "/avatar/user5.jpg",
  "/avatar/user6.jpg",
  "/avatar/user7.jpg",
];

export default function UsersPage() {
  const [avatar, setAvatar] = useState(avatarList[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const user = {
    lastName: "Кузнецов",
    firstName: "Сергей",
    patronymic: "Иванович",
    gender: "мужчина",
    birthday: "12.09.1992",
    dept: "№23.06",
    employeeId: "№458213",
    exp: "5 лет.",
  };

  return (
    <div className="usersWrap">
      <Sidebar />

      <div className="usersMain">
        {/* topbar как у вас */}
        <header className="usersTopbar">
          <div className="usersTopbarLeft" />
          <div className="usersTopbarRight">
            <div className="topAvatar" />
            <div className="topBadge" />
          </div>
        </header>

        <div className="usersContent">
          {/* Верхняя строка: слева профиль + инфо, справа большой блок */}
          <div className="usersGridTop">
            <div className="profileCard">
              <button
                type="button"
                className="avatarCircle"
                onClick={() => setPickerOpen(true)}
                title="Выбрать аватар"
              >
                {/* аватар картинка */}
                <img src={avatar} alt="avatar" />
              </button>

              <div className="fullName">
                <div>{user.lastName} {user.firstName}</div>
                <div>{user.patronymic}</div>
              </div>
            </div>

            <div className="infoCard">
              <div className="infoTitle">личная информация</div>

              <div className="infoRow">
                <span className="infoLabel">Пол</span>
                <span className="infoValue">{user.gender}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Дата рождения</span>
                <span className="infoValue">{user.birthday}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Номер отдела</span>
                <span className="infoValue">{user.dept}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Номер сотрудника</span>
                <span className="infoValue">{user.employeeId}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Стаж</span>
                <span className="infoValue">{user.exp}</span>
              </div>
            </div>

            <div className="rightBigCard" />
          </div>

          {/* Нижняя строка: два больших блока */}
          <div className="usersGridBottom">
            <div className="bottomCard">
              <div className="cardTopLine" />
            </div>

            <div className="bottomCard">
              <div className="cardTopLine short" />
            </div>
          </div>
        </div>

        {/* Модалка выбора аватара */}
        {pickerOpen && (
          <div className="modalOverlay" onClick={() => setPickerOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHead">
                <div className="modalTitle">Выбери аватар</div>
                <button className="xBtn" type="button" onClick={() => setPickerOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="avatarGrid">
                {avatarList.map((src) => (
                  <button
                    key={src}
                    type="button"
                    className={`avatarPick ${src === avatar ? "active" : ""}`}
                    onClick={() => {
                      setAvatar(src);
                      setPickerOpen(false);
                    }}
                  >
                    <img src={src} alt="pick" />
                  </button>
                ))}
              </div>

              <div className="modalHint">
                Папка: <b>public/avatars</b> (добавляй свои картинки туда)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
