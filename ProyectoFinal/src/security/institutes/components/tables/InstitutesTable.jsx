//FIC: React
import React, { useEffect, useMemo, useState } from "react";
//FIC: Material UI
import { MaterialReactTable } from 'material-react-table';
import { Box, Stack, Tooltip, Button, IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
//FIC: DB
//import InstitutesStaticData from '../../../../../db/security/json/institutes/InstitutesData';
import { getAllInstitutes } from '../services/remote/get/GetAllInstitutes';
//FIC: Modals
import AddInstituteModal from "../modals/AddInstituteModal";

import UpdateInstituteModal from "../modals/UpdateInstituteModal";
//FIC: Columns Table Definition.
const InstitutesColumns = [
  {
    accessorKey: "IdInstitutoOK",
    header: "ID OK",
    size: 30, //small column
  },
  {
    accessorKey: "IdInstitutoBK",
    header: "ID BK",
    size: 30, //small column
  },
  {
    accessorKey: "DesInstituto",
    header: "INSTITUTO",
    size: 150, //small column
  },
  {
    accessorKey: "Alias",
    header: "ALIAS",
    size: 50, //small column
  },
  {
    accessorKey: "Matriz",
    header: "MATRIZ",
    size: 30, //small column
  },
  {
    accessorKey: "IdTipoGiroOK",
    header: "GIRO",
    size: 150, //small column
  },
  {
    accessorKey: "IdInstitutoSupOK",
    header: "ID OK SUP",
    size: 30, //small column
  },
];
//FIC: Table - FrontEnd.
const InstitutesTable = () => {
  const [loadingTable, setLoadingTable] = useState(true);
  const [InstitutesData, setInstitutesData] = useState([]);
  const [AddInstituteShowModal, setAddInstituteShowModal] = useState(false);
  const [UpdateInstituteShowModal, setUpdateInstituteShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const AllInstitutesData = await getAllInstitutes();
      setInstitutesData(AllInstitutesData);
      setLoadingTable(false);
    } catch (error) {
      console.error("Error al obtener los institutos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);  // Esto asegura que la tabla se actualice al seleccionar un instituto.
  

 
  return (
    <Box>
      <MaterialReactTable
        columns={InstitutesColumns}
        data={InstitutesData}
        state={{ isLoading: loadingTable }}
        initialState={{ density: "compact", showGlobalFilter: true }}
        renderTopToolbarCustomActions={({ table }) => (
          <Stack direction="row" sx={{ m: 1 }}>
            <Box>
              <Tooltip title="Agregar">
                <IconButton onClick={() => setAddInstituteShowModal(true)}>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton onClick={() => setUpdateInstituteShowModal(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Detalles ">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        )}
      />
      {/* Modal de agregar instituto */}
      <Dialog open={AddInstituteShowModal}>
        <AddInstituteModal
          AddInstituteShowModal={AddInstituteShowModal}
          setAddInstituteShowModal={setAddInstituteShowModal}
          UpdateTable={fetchData}
          onClose={() => setAddInstituteShowModal(false)}
        />
      </Dialog>

      {/* Modal de actualización de instituto */}
      <Dialog open={UpdateInstituteShowModal}>
        <UpdateInstituteModal
          UpdateInstituteShowModal={UpdateInstituteShowModal}
          setUpdateInstituteShowModal={setUpdateInstituteShowModal}
          UpdateTable={fetchData}
          onInstituteUpdated={fetchData} // Actualizar la tabla después de la actualización
        />
      </Dialog>
    </Box>
  );
};

export default InstitutesTable;