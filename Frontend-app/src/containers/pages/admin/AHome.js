import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Button, Table, Form} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faCheck} from '@fortawesome/free-solid-svg-icons';
import '../../../assets/css/pages/a_home.css'

import {banUser, getUsers, unbanUser} from "../../../actions/admin";
import AUsersChart from "./AUsersChart";
import ALoadChart from "./ALoadChart";


const userLabels = [
    "Администраторы", "Неактивные пользователи", "Активные пользователи",
    "Заблокированные пользователи"
]

const AHome = ({getUsers, banUser, unbanUser}) => {
    const [users, setUsers] = useState(null);
    const [f_Users, setF_Users] = useState(users);
    const [userChart, setUserChart] = useState(null);
    useEffect(() => {
        getUsers().then(result => {
            if (result[0]) {
                setUsers(result[1]);
                setF_Users(result[1]);
                const data = {};
                userLabels.forEach(label => {
                    data[label] = 0;
                });
                result[1].forEach(value => {
                    if (value.is_admin) data["Администраторы"] += 1;
                    if (!value.is_active) data["Неактивные пользователи"] += 1;
                    if (value.is_active && !value.is_banned) data["Активные пользователи"] += 1;
                    if (value.is_banned) data["Заблокированные пользователи"] += 1;
                });
                setUserChart(data);
            }
        })
    }, []);

    const handleBan = (username) => {
        banUser(username).then(result => {
            if (result[0]) window.location.reload();
        })
    };
    const handleUnban = (username) => {
        unbanUser(username).then(result => {
            if (result[0]) window.location.reload();
        })
    };

    const [search, setSearch] = useState("");
    const [byName, setByName] = useState(true);
    const [admins, setAdmins] = useState(true);
    const [active, setActive] = useState(true);
    const [nonActive, setNonActive] = useState(true);
    const [banned, setBanned] = useState(true);
    const [unbanned, setUnbanned] = useState(true);

    useEffect(() => {
        if (f_Users !== null) {
            setF_Users(users
                .filter(user => {
                    let value;
                    if (byName) { if (user.username.toLowerCase().includes(search.toLowerCase())) value = user; }
                    else { if (user.email.includes(search)) value = user; }
                    if (value !== undefined) {
                        if (!admins && user.is_admin) return undefined;
                        if (!active && user.is_active) return undefined;
                        if (!nonActive && !user.is_active) return undefined;
                        if (!banned && user.is_banned) return undefined;
                        if (!unbanned && !user.is_banned) return undefined;
                    }
                    return value;
                })
            );
        }
    }, [search, byName, admins, active, nonActive, banned, unbanned])

    return (<div className="container">
        <div style={{marginTop: '15vh'}}/>
        <h1>Статистика</h1>
        {userChart !== null && (
            <div className="admin-charts">
                <div className="admin-chart">
                    <p>Пользователи системы</p>
                    <AUsersChart data={userChart} width={400} height={400}/>
                </div>
                <div className="admin-chart">
                    <p>Нагрузка системы (%)</p>
                    <ALoadChart data={userChart["Активные пользователи"]} width={700} height={350}/>
                </div>
            </div>
        )}
        <h1>Пользователи</h1>
        <div className="admin-users-form">
            <div className="search">
                <Form.Control
                    type="text"
                    placeholder="Поиск..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="d-flex justify-content-around mt-2">
                    <Form.Check
                        type="radio"
                        label="По имени"
                        checked={byName}
                        onChange={e => setByName(e.target.checked)}
                    />
                    <Form.Check
                        type="radio"
                        label="По e-mail"
                        checked={!byName}
                        onChange={e => setByName(!e.target.checked)}
                    />
                </div>
            </div>
            <div className="filter">
                <p>Фильтры</p>
                <div className="d-flex">
                    <Form.Check
                        className="me-3 mt-2"
                        label="Администраторы"
                        checked={admins}
                        onChange={e => setAdmins(e.target.checked)}
                    />
                    <Form.Check
                        className="me-3 mt-2"
                        label="Активированные"
                        checked={active}
                        onChange={e => setActive(e.target.checked)}
                    />
                    <Form.Check
                        className="me-3 mt-2"
                        label="Не активированные"
                        checked={nonActive}
                        onChange={e => setNonActive(e.target.checked)}
                    />
                    <Form.Check
                        className="me-3 mt-2"
                        label="Имеют доступ"
                        checked={unbanned}
                        onChange={e => setUnbanned(e.target.checked)}
                    />
                    <Form.Check
                        className="me-3 mt-2"
                        label="Не имеют доступ"
                        checked={banned}
                        onChange={e => setBanned(e.target.checked)}
                    />
                </div>
            </div>
        </div>
        <Table className="admin-users-table" striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Имя пользователя</th>
                <th>E-mail</th>
                <th>Администратор</th>
                <th>Активирован</th>
                <th>Имеет доступ</th>
                <th>Управление доступом</th>
            </tr>
            </thead>
            <tbody>
            {f_Users !== null && (
                f_Users.map((user, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td style={{textAlign: 'center'}}>
                            {user.is_admin ? (
                                <FontAwesomeIcon style={{color: '#30cf3d'}} icon={faCheck}/>
                            ) : (
                                <FontAwesomeIcon style={{color: '#DC143C'}} icon={faXmark}/>
                            )}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {user.is_active ? (
                                <FontAwesomeIcon style={{color: '#30cf3d'}} icon={faCheck}/>
                            ) : (
                                <FontAwesomeIcon style={{color: '#DC143C'}} icon={faXmark}/>
                            )}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {!user.is_banned ? (
                                <FontAwesomeIcon style={{color: '#30cf3d'}} icon={faCheck}/>
                            ) : (
                                <FontAwesomeIcon style={{color: '#DC143C'}} icon={faXmark}/>
                            )}
                        </td>
                        <td style={{textAlign: 'end'}}>
                            {!user.is_admin ? (
                                user.is_banned ? (
                                    <Button
                                        variant="link"
                                        className="admin-unban"
                                        onClick={() => handleUnban(user.username)}
                                    >
                                        Разблокировать
                                    </Button>
                                ) : (
                                    <Button
                                        variant="link"
                                        className="admin-ban"
                                        onClick={() => handleBan(user.username)}
                                    >
                                        Заблокировать
                                    </Button>
                                )
                            ) : (
                                <span>Запрещено</span>
                            )}
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </Table>
    </div>);
}

export default connect(null, {getUsers, banUser, unbanUser})(AHome);