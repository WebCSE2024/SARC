import sigData from "../data/sig.data.json";

export const getSIGData = () => {
  return sigData.sigs;
};

export const getSIGById = (sigId) => {
  return sigData.sigs.find((sig) => sig.id === sigId);
};

export const getProfessorsBySIG = (sigId) => {
  return sigData.professors.filter((prof) => prof.sigId === sigId);
};

export const getPublicationsBySIG = (sigId) => {
  return sigData.publications.filter((pub) => pub.sigId === sigId);
};

export const getSeminarsBySIG = (sigId) => {
  return sigData.seminars.filter((sem) => sem.sigId === sigId);
};

export const getProfessorById = (professorId) => {
  return sigData.professors.find((prof) => prof.id === professorId);
};

export const getPublicationsByProfessor = (professorId) => {
  return sigData.publications.filter((pub) => pub.professorId === professorId);
};

export const getSeminarsByProfessor = (professorId) => {
  return sigData.seminars.filter((sem) => sem.professorId === professorId);
};

export const getAllPublications = () => {
  return sigData.publications;
};

export const getAllSeminars = () => {
  return sigData.seminars;
};

export const getAllProfessors = () => {
  return sigData.professors;
};
