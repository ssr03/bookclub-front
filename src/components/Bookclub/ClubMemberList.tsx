import {AgGridReact} from "ag-grid-react";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import axiosConfig from "@utils/axiosConfig";
import moment from 'moment';
import BtnRenderer from "@components/agGrid/BtnRenderer";
import {useSelector} from "react-redux";
import {ReducerType} from "@src/modules";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface ClubMemberListProps {
    clubId: string
}

interface ClubMember{
    memberId: number,
    username: string,
    clubAuth: string,
    firstName: string,
    lastName: string,
    email: string,
    clubJoinDate: string,
    sessionCnt: number,
    isEnabled: boolean
}

interface ClubMemberList {
    codeList: [
        {
            code: string,
            value: string
        }
    ],
    memberList: ClubMember[]
}

const MySwal = withReactContent(Swal);

const ClubMemberList = (props: ClubMemberListProps) =>{
    const {clubId} = props;

    const [error, setError] = useState(null);

    let codeList = useSelector((state: ReducerType) => state.actionOfClubAuth.codeList);
    let session = useSelector((state: ReducerType) => state.session.loginInfo)

    const [memberList, setMemberList] = useState<ClubMemberList["memberList"]>(
        []);

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
        };
    }, []);

    const frameworkComponents = {
        btnRenderer: BtnRenderer
    }

    const [columnDefs, setColumnDefs] = useState([
    // const columnDefs = [
        {
            headerName: 'NO',
            field: 'no',
            width:100,
            type: 'numericColumn',
            valueFormatter: (params:any) => {
                return params.node.rowIndex+1;
            }
        },
        {
            headerName: '아이디',
            field: 'username',
            width:150,
        },
        {
            headerName: '권한',
            field: 'clubAuth',
            width:100,
            editable:true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: codeList.map(value=>value.code)
            },
            valueFormatter: (params:any) => {
                return codeList.filter(value => params.value===value.code).map(value=>value.value)[0]
            }
        },
        {
            headerName: '선호(관심)주제',
            field: 'interest',
            width:180,
        },
        {
            headerName: '클럽 가입일',
            field: 'clubJoinDate',
            type:'dateColumn',
            width:120,
            valueFormatter: (params:any) => {
                return moment(params.value).format('YYYY-MM-DD')
            }
        },
        {
            headerName: '세션 참여 횟수',
            field: 'sessionCnt' ,
            width:150,
        },
        {
            headerName: '메일보내기',
            field: 'email',
            width:150,
            cellRenderer: 'btnRenderer',
        },
        {
            headerName: '퇴출',
            field: 'exit',
            width:150,
            cellRenderer: 'btnRenderer',
            cellRendererParams:(param:any)=>{
                return {
                    disable: !param.node.data.isEnabled,
                    funcNm: banMember
                }
            }
        },
        {
            headerName:"memberId",
            field:'memberId',
            hide:true
        }
        // ]
    ]);

    useEffect(() => {
        // 컴포넌트 로드시 1번 실행
        getMemberList();
    }, []);

    const onCellEditingStopped = useCallback((event) => {
        updateMemberClubAuth(event.node.data);
    }, []);

    const updateMemberClubAuth = (member:ClubMember) =>{
        let memberId = member.memberId;

        axiosConfig.put(`api/v1/bookclub/${clubId}/member`,{
                memberId: memberId,
                clubAuth: member.clubAuth,
            })
            .then(function (response) {
                // success
                // setMemberList(prevState =>
                //     prevState.map(member => member.memberId === memberId ? response.data : member));
                getMember(response.data.memberId);

            })
            .catch(function (error) {
                // error
                MySwal.fire({
                    icon: "error",
                    text: error.response.data.message,
                });

                getMember(memberId);

            })
            .then(function () {
                // finally
            });
    }

    const banMember = (member:ClubMember) =>{
        let memberId = member.memberId;

        axiosConfig.put(`api/v1/bookclub/${clubId}/member/banned`,{
            memberId: memberId
        })
            .then(function (response) {
                // success
                setMemberList(prevState =>
                    prevState.map(member => member.memberId === memberId ?
                            {...member,
                                clubAuth: response.data.clubAuth,
                                isEnabled: false} : member));

            })
            .catch(function (error) {
                // error
                MySwal.fire({
                    icon: "error",
                    text: error.response.data.message,
                });

                getMember(memberId);
            })
            .then(function () {
                // finally
            });
    }

    const getMember = (memberId:number) => {
        axiosConfig.get(`api/v1/bookclub/${clubId}/member/${memberId}`)
            .then(function (response) {
                // success
                setMemberList(prevState =>
                    prevState.map(member => member.memberId === memberId ? response.data : member));

            })
            .catch(function (error) {
                // error
                MySwal.fire({
                    icon: "error",
                    text: error.response.data.message,
                });
            })
            .then(function () {
                // finally
            });
    }

    const getMemberList = () => {
        setError(null)
        axiosConfig.get(`api/v1/bookclub/${clubId}/member/list`)
            .then(function (response) {
                // success
                setMemberList(response.data);
            })
            .catch(function (error) {
                // error
                setError(error)
            })
            .then(function () {
                // finally
            });
    }

    return (
        <div className="ag-theme-alpine grid_search_height2">
            <AgGridReact
                columnDefs={columnDefs}
                rowData={memberList}
                defaultColDef={defaultColDef}
                frameworkComponents={frameworkComponents}
                onCellEditingStopped={onCellEditingStopped}
            >
            </AgGridReact>
        </div>
    );
}

export default ClubMemberList;
