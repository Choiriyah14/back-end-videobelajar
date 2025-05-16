import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getTutors = async (req, res) => {
    try {
        const tutors = await prisma.tutor.findMany();
        return res.status(200).json({
            code: 200,
            message: "Tutors fetched successfully",
            data: tutors,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
};

const getTutorById = async (id) => {
    return await prisma.tutor.findUnique({
        where: { id },
    });
};

const getOneTutor = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({
          code: 400,
          message: "Tutor ID is required",
          data: null,
        });
      }
  
      const tutor = await getTutorById(id);
      if (!tutor) {
        return res.status(404).json({
          code: 404,
          message: "Tutor not found",
          data: null,
        });
      }
  
      return res.status(200).json({
        code: 200,
        message: "Tutor found",
        data: tutor,
      });
  
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: 500,
            message: "An unexpected error occurred while fetching the tutor",});
    }
  };
  
const createTutor = async (req, res, next) => {
    try {
        const { skills, description, name } = req.body;

        const post = await prisma.tutor.create({
            data: { name, skills, description }
        });

        return res.status(201).json({
            code: 201,
            message: "Tutor created successfully",
            data: post,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
        });
    }
};

const updateTutor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, skills, description } = req.body;

        const existingTutor = await prisma.tutor.findUnique({
            where: { id },
        });

        if (!existingTutor) {
            return res.status(404).json({
                code: 404,
                message: "Tutor not found",
                data: null,
            });
        }

        const updatedTutor = await prisma.tutor.update({
            where: { id },
            data: {
                name,
                skills,
                description,
            },
        });

        return res.status(200).json({
            code: 200,
            message: "Successfully updated tutor",
            data: updatedTutor,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: "An unexpected error occurred",
        });
    }
};

const deleteTutor = async (req, res, next) => {
    try {
        const {id}  = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                message: "Tutor ID is required",
                data: null,
            });
        }

        const existingTutor = await prisma.tutor.findUnique({
            where: { id },
        });

        if (!existingTutor) {
            return res.status(404).json({
                code: 404,
                message: "Tutor not found",
                data: null,
            });
        }

        // Hapus user
        const deletedTutor = await prisma.tutor.delete({
            where: { id },
        });

        return res.status(200).json({
            code: 200,
            message: "Successfully deleted tutor",
            data: deletedTutor,
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error",
        });
    }
};

export {
    getTutors,
    getTutorById,
    getOneTutor,
    createTutor,
    updateTutor,
    deleteTutor,
}