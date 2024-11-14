import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, DialogActions, Alert, Box,
    IconButton, TextField
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh"; // Icono para el botón de refrescar
import { DeleteOneInstitute } from "../services/remote/delete/DeleteOneInstitute"; // Asegúrate de importar tu función de eliminación
import { getInstituteById } from "../services/remote/get/GetInstituteById"; // Asegúrate de importar la función de búsqueda

const DeleteInstituteModal = ({ deleteInstituteShowModal, setDeleteInstituteShowModal, onInstituteDeleted, instituteIdProp }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [foundInstitute, setFoundInstitute] = useState(null);
    const [instituteId, setInstituteId] = useState(instituteIdProp || "");  // Añadido el estado para instituteId

    const handleCloseModal = () => {
        setDeleteInstituteShowModal(false);
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setFoundInstitute(null);
        setInstituteId("");  // Limpiar el ID cuando se cierra el modal
    };

    const handleSearchInstitute = async () => {
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        
        try {
            const institute = await getInstituteById(instituteId);
            if (!institute) {
                setMensajeErrorAlert("Instituto no encontrado");
                setFoundInstitute(null);
            } else {
                setFoundInstitute(institute);
                setIsSearchDisabled(true); // Desactivar el botón de búsqueda
            }
        } catch (error) {
            setMensajeErrorAlert("No se pudo encontrar el Instituto");
        }
    };

    const handleDeleteInstitute = async () => {
        if (!foundInstitute) return;
        
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setLoading(true);

        try {
            await DeleteOneInstitute(instituteId); // Llamar a la función de eliminación
            setMensajeExitoAlert("Instituto eliminado correctamente");

            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setMensajeExitoAlert(""), 5000);

            if (onInstituteDeleted) {
                onInstituteDeleted(); // Llamar al callback de actualización de la tabla
            }

            handleRefresh(); // Refrescar la vista después de eliminar
        } catch (error) {
            setMensajeErrorAlert("No se pudo eliminar el Instituto");

            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setMensajeErrorAlert(""), 5000);
        }

        setLoading(false);
    };

    const handleRefresh = () => {
        // Limpiar todos los estados relacionados con la búsqueda
        setInstituteId(""); 
        setFoundInstitute(null);
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setIsSearchDisabled(false); // Habilitar el botón de búsqueda nuevamente
    };

    return (
        <Dialog open={deleteInstituteShowModal} onClose={handleCloseModal} fullWidth>
            <DialogTitle>
                <Typography component="h6">
                    <strong>Eliminar Instituto</strong>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                    {mensajeErrorAlert && <Alert severity="error"><b>¡ERROR!</b> ─ {mensajeErrorAlert}</Alert>}
                    {mensajeExitoAlert && <Alert severity="success"><b>¡ÉXITO!</b> ─ {mensajeExitoAlert}</Alert>}
                    
                    {/* Campo de búsqueda del instituto */}
                    <TextField
                        id="IdInstitutoOK"
                        label="Buscar Instituto por ID"
                        value={instituteId}
                        onChange={(e) => setInstituteId(e.target.value)} // Actualiza el estado correctamente
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <IconButton onClick={handleSearchInstitute} color="primary" disabled={isSearchDisabled}>
                        <SearchIcon />
                    </IconButton>

                    {/* Si el instituto se encontró, mostrar información */}
                    {foundInstitute && (
                        <Box mt={2}>
                            <Typography>Instituto encontrado:</Typography>
                            <Typography><strong>ID:</strong> {foundInstitute.IdInstitutoOK}</Typography>
                            <Typography><strong>Descripción:</strong> {foundInstitute.DesInstituto}</Typography>
                        </Box>
                    )}
                    {!foundInstitute && <Typography mt={2}>Introduce un ID para buscar el instituto.</Typography>}
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box m="auto">
                    <LoadingButton
                        color="secondary"
                        startIcon={<CloseIcon />}
                        variant="outlined"
                        onClick={handleCloseModal}
                    >
                        CERRAR
                    </LoadingButton>
                    <LoadingButton
                        color="error"
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        onClick={handleDeleteInstitute}
                        loading={loading}
                        disabled={!foundInstitute} // Deshabilitar si no se encontró el instituto
                    >
                        ELIMINAR
                    </LoadingButton>
                    <LoadingButton
                        color="primary"
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={handleRefresh} // Llamar a la función de refresco
                    >
                        REFRESCAR
                    </LoadingButton>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteInstituteModal;
