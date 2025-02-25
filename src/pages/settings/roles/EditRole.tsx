import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import axiosConfig from "@utils/axiosConfig";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EditRole = (props: any) => {
  let navigate = useNavigate();
  let { role } = useParams();
  const [roleName, setRoleName] = useState(role);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  let allUser = useSelector((state: RootStateOrAny) => state.actionOfUser.allUser);
  const [userList, setUserList] = useState(allUser);
  let roleCodeList = useSelector((state: RootStateOrAny) => state.actionOfSettings.roleList);
  const [roleList, setRoleList] = useState(roleCodeList);

  useEffect(() => {
    //let { role } = useParams();
    getUserListByRole(role);
    //TODO setPermissions by getPermissionsByRole(role);
  }, []);

  const getUserListByRole = (role: any) => {
    axiosConfig.get("/api/role/users", {
      params: {
        role: role,
      },
    })
      .then(function (response) {
        // success
        //TODO
        let usernameList: any = [];
        response.data.forEach((element: { [x: string]: string; }) => {
          usernameList.push({
            value: element["username"],
            label: element["firstName"] + " " + element["lastName"],
          });
        });
        setUsers(usernameList);
      })
      .catch(function (error) {
        // error
      })
      .then(function () {
        // finally
      });
  };

  const getUserDetails = (userId: any) => {
    axiosConfig.get("/api/user/detail", {
      params: {
        username: userId,
      },
    })
      .then(function (response) {
        // success
      })
      .catch(function (error) {
        // error
      })
      .then(function () {
        // finally
      });
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    let formValue = value;
  };

  const filterUsers = (inputValue: string) => {
    return userList.filter((i: { label: string; }) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const promiseUserOptions = (inputValue: string) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterUsers(inputValue));
      }, 1000);
    });
  const handleInputChangeUserOptions = (selectedOption: any) => {
    if (selectedOption.length > 0) {
      let values = [];
      selectedOption.forEach((el: { [x: string]: any; }, key: any) => {
        let set = { key: key, value: el["value"] };
        values.push(set);
      });

      setUserList(selectedOption);
    } else {
      let values: any[] = [];

      setUserList(values);
    }
  };

  const editRole = () => {
    if (roleName?.toString.length === 0) {
      return;
    }

    MySwal.fire({
      icon: "error",
      text: "아직 기능이 구현되지 않았습니다.",
    });

    //TODO:
    // axiosConfig.put("/api/role", {
    //   role: roleName,
    //   permissions: permissions,
    //   users: users,
    // })
    //   .then(function (response) {
    //     // success
    //     MySwal.fire({
    //       icon: "success",
    //       text: "Success!",
    //     });
    //   })
    //   .catch(function (error) {
    //     // error
    //     //alert("Failed to save this Dataset.");
    //     MySwal.fire({
    //       icon: "error",
    //       text: "Failed to update the user information.",
    //     });
    //   })
    //   .then(function () {
    //     // finally
    //   });
  };

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <div className="row align-items-start">
            <div className="input-group">Edit Role</div>
          </div>
        </div>
      </div>
      <div className="container">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row" style={{ width: "20%" }}>
                Role Name<span style={{ color: "red" }}>*</span>
              </th>
              <td>
                <input
                  className="form-control"
                  name="role"
                  value={role}
                  onChange={handleInputChange}
                  placeholder="Role Name"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">Permissions</th>
              <td>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  defaultOptions
                  placeholder={"choose one or more"}
                  //   loadOptions={promiseRoleOptions}
                  //   onChange={handleInputChangeRoleOptions}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">User</th>
              <td>
                <AsyncSelect
                  value={users}
                  isMulti
                  cacheOptions
                  defaultOptions
                  placeholder={"choose one or more"}
                  loadOptions={promiseUserOptions}
                  onChange={handleInputChangeUserOptions}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"></div>
      </div>
      <div className="container">
        <form className="d-flex">
          <div style={{ display: "inline-block", paddingRight: "5px" }}>
            <button
              className="btn btn-success"
              type="button"
              onClick={editRole}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
