import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Help order not found' }] });
    }

    if (helpOrder.answer_at !== null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'This question has already been answered' }] });
    }

    const updatedHelpOrder = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, { helpOrder });

    return res.json(updatedHelpOrder);
  }
}

export default new AnswerController();
