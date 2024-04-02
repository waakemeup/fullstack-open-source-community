import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import React, { useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Department from "../../types/Department";
import ShowDepartment from "../../components/Modals/ShowDepartment";
import { Info } from "@mui/icons-material";
import EditDepartment from "../../components/Modals/EditDepartment";
import AddDepartment from "../../components/Modals/AddDepartment";
import axios from "../../api";
import { useAuthState } from "../../context/auth";
import { redirect, useNavigate } from "react-router";
import { Avatar } from "@mui/joy";
import { UserStoreContext } from "../../store/UserStore";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  setAddDepartmentModal: (oldAddDepartmentModal: boolean) => void;
  addDepartmentModal: boolean;
}

function EditToolbar(props: EditToolbarProps) {
  const { addDepartmentModal, setAddDepartmentModal } = props;

  const handleClick = () => {
    setAddDepartmentModal(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const FullFeaturedCrudGrid = () => {
  const {
    data: departments,
    error,
    isLoading,
    mutate: departmentsMutate,
  } = useSWR<Department[]>("department/find/all", {
    suspense: true,
  });

  console.log(departments);

  let initialRows: GridRowsProp =
    departments?.map((deparment) => {
      return {
        id: deparment.id,
        img: deparment.imgUrl,
        owner: deparment.owner?.name || "",
        description: deparment.description,
        title: deparment.title,
        name: deparment.name,
      };
    }) || [];

  console.log("test1:" + initialRows);

  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editDepartmentModal, setEditDepartmentModal] = useState(false);
  const [addDepartmentModal, setAddDepartmentModal] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);

  const {
    data: selectedDepartmentData,
    error: error2,
    mutate: findByIdMutate,
  } = useSWR<Department>(
    selectedDepartmentId !== null
      ? `department/find/${selectedDepartmentId}`
      : null,
    {
      suspense: true,
    }
  );

  useEffect(() => {
    console.log(selectedDepartmentData);
    findByIdMutate();
  }, [selectedDepartmentId]);

  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  useEffect(() => {
    console.log("test3:" + rows, departments);
    departmentsMutate();
    initialRows =
      departments?.map((deparment) => {
        return {
          id: deparment.id,
          img: deparment.imgUrl,
          owner: deparment.owner?.name || "",
          description: deparment.description,
          title: deparment.title,
          name: deparment.name,
        };
      }) || [];
    // setRows(initialRows)
  }, [rows]);

  const handleDataUpdate = (updatedRows: any) => {
    setRows(updatedRows);
  };

  const handleDepartmentShowModal = (id: GridRowId) => {
    setShowDepartmentModal(!showDepartmentModal);
    setSelectedDepartmentId(id as number | null);
    // console.log(showDepartmentModal, selectedDepartmentId);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setSelectedDepartmentId(id as number | null);
    setEditDepartmentModal(!editDepartmentModal);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const res = axios.delete(`department/delete/${id}`);
    console.log(res);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "序号",
      type: "number",
      width: 40,
      editable: false,
      sortable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      // TODO:
      field: "img",
      headerName: "社团logo",
      type: "custom",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: false,
      renderCell: ({ row }) => {
        return (
          <Avatar src={row.img} size="lg">
            {row.name}
          </Avatar>
        );
      },
    },
    {
      field: "name",
      headerName: "社团名称",
      type: "string",
      width: 180,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "intro",
      type: "actions",
      headerName: "社团介绍",
      width: 220,
      editable: false,
      cellClassName: "intro",
      headerAlign: "center",
      align: "center",
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            icon={<Info />}
            label="info"
            component={"button"}
            sx={{
              color: "#4ebeab",
            }}
            size="large"
            onClick={() => {
              handleDepartmentShowModal(id);
              findByIdMutate();
            }}
            key={id}
          />,
        ];
      },
    },
    {
      field: "owner",
      headerName: "社长",
      type: "string",
      width: 180,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        // if (isInEditMode) {
        //   return [
        //     <GridActionsCellItem
        //       icon={<SaveIcon />}
        //       label="Save"
        //       sx={{
        //         color: "primary.main",
        //       }}
        //       onClick={handleSaveClick(id)}
        //     />,
        //     <GridActionsCellItem
        //       icon={<CancelIcon />}
        //       label="Cancel"
        //       className="textPrimary"
        //       onClick={handleCancelClick(id)}
        //       color="inherit"
        //     />,
        //   ];
        // }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            setAddDepartmentModal,
            addDepartmentModal,
          },
        }}
      />
      <ShowDepartment
        open={showDepartmentModal}
        title={selectedDepartmentData?.title || ""}
        description={selectedDepartmentData?.description || ""}
        name={selectedDepartmentData?.name || ""}
        handleClose={() => setShowDepartmentModal(false)}
      />
      <EditDepartment
        open={editDepartmentModal}
        handleClose={() => setEditDepartmentModal(false)}
        id={selectedDepartmentId as number}
        description={selectedDepartmentData?.description || ""}
        name={selectedDepartmentData?.name || ""}
        title={selectedDepartmentData?.title || ""}
        onDataUpdate={handleDataUpdate}
        img={selectedDepartmentData?.imgUrl || ""}
        headerId={selectedDepartmentData?.owner?.id || null}
      />
      <AddDepartment
        open={addDepartmentModal}
        handleClose={() => setAddDepartmentModal(false)}
        name={""}
        title={""}
        description={""}
        onDataUpdate={handleDataUpdate}
      />
    </Box>
  );
};

function DepartmentInfo() {
  // const { user, authenticated } = useAuthState();
  const { user, authenticated } = useContext(UserStoreContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) navigate("/login");
  }, []);

  return (
    <>
      <div>DepartmentInfo</div>
      {authenticated && <FullFeaturedCrudGrid />}
    </>
  );
}

export default DepartmentInfo;
