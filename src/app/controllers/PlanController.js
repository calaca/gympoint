import { validationResult } from 'express-validator';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ errors: [{ msg: 'Plan not found' }] });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ errors: [{ msg: 'Plan not found' }] });
    }

    await plan.destroy();

    return res.json({ message: 'Plan deleted successfully' });
  }
}

export default new PlanController();
