def compute_score(assessment):
    score = 100
    water_savings = 0
    cost_saving = 0

    if assessment.sprinkler_duration > 60:
        score -= 15
    elif assessment.sprinkler_duration > 45:
        score -= 8

    source_penalty = {'municipal': 5, 'borewell': 10, 'recycled': 0, 'rainwater': 0}
    score -= source_penalty.get(assessment.water_source, 5)

    schedule_penalty = {'early_morning': 0, 'morning_evening': 5, 'continuous': 15, 'on_demand': 3}
    score -= schedule_penalty.get(assessment.irrigation_schedule, 5)

    sensor_bonus = {'none': 0, 'partial': 3, 'full': 8}
    score += sensor_bonus.get(assessment.moisture_sensors, 0)

    chemical_penalty = {'weekly': 15, 'biweekly': 8, 'monthly': 3, 'seasonal': 0}
    score -= chemical_penalty.get(assessment.chemical_frequency, 8)

    method_bonus = {'broad_spectrum': 0, 'targeted': 5, 'biological': 10, 'mixed': 5}
    score += method_bonus.get(assessment.pest_control_method, 0)

    weed_penalty = {'low': 0, 'moderate': 3, 'high': 7, 'severe': 12}
    score -= weed_penalty.get(assessment.weed_severity, 3)

    biodiversity_count = len(assessment.species_observed)
    if biodiversity_count >= 4:
        score += 5
    elif biodiversity_count == 0:
        score -= 5

    if assessment.mowing_frequency > 5:
        score -= 10
    elif assessment.mowing_frequency > 3:
        score -= 4

    energy_bonus = {'petrol_diesel': 0, 'mixed': 3, 'electric': 10, 'hybrid': 7}
    score += energy_bonus.get(assessment.energy_source, 0)

    score = max(0, min(100, score))

    base_water = 100
    if assessment.sprinkler_duration <= 30:
        water_savings = 35
    elif assessment.sprinkler_duration <= 45:
        water_savings = 28
    elif assessment.sprinkler_duration <= 60:
        water_savings = 15
    else:
        water_savings = 5

    if assessment.moisture_sensors == 'full':
        water_savings += 10
    elif assessment.moisture_sensors == 'partial':
        water_savings += 5

    water_savings = min(water_savings, 50)

    water_cost_monthly = 80000
    chemical_cost_monthly = 40000
    energy_cost_monthly = 30000

    water_saving_inr = (water_cost_monthly * water_savings) / 100
    chemical_saving = chemical_cost_monthly * 0.3 if assessment.pest_control_method in ('biological', 'targeted') else 0
    energy_saving = energy_cost_monthly * 0.2 if assessment.energy_source in ('electric', 'hybrid') else 0
    cost_saving = water_saving_inr + chemical_saving + energy_saving

    if biodiversity_count == 0 and assessment.chemical_frequency == 'weekly':
        biodiversity_risk = 'High'
    elif biodiversity_count >= 3 or assessment.chemical_frequency in ('seasonal', 'monthly'):
        biodiversity_risk = 'Low'
    else:
        biodiversity_risk = 'Medium'

    if assessment.chemical_frequency == 'weekly' and assessment.pest_control_method == 'broad_spectrum':
        chemical_dependency = 'High'
    elif assessment.chemical_frequency in ('seasonal',) or assessment.pest_control_method in ('biological',):
        chemical_dependency = 'Low'
    else:
        chemical_dependency = 'Medium'

    priorities = []
    if assessment.sprinkler_duration > 50 or assessment.moisture_sensors == 'none':
        priorities.append('Irrigation optimisation')
    if assessment.pest_control_method == 'broad_spectrum':
        priorities.append('Switch to biological pest control')
    if assessment.energy_source == 'petrol_diesel':
        priorities.append('Transition to electric or hybrid equipment')
    if biodiversity_risk == 'High':
        priorities.append('Biodiversity protection zones')

    priority = priorities[0] if priorities else 'General sustainability improvements'

    return {
        'sustainability_score': score,
        'water_savings_pct': water_savings,
        'estimated_cost_saving_monthly': round(cost_saving, 2),
        'biodiversity_risk': biodiversity_risk,
        'chemical_dependency': chemical_dependency,
        'priority_recommendation': priority,
    }


def generate_recommendations(assessment):
    recs = []
    order = 0

    if assessment.sprinkler_duration > 45 or assessment.moisture_sensors == 'none':
        recs.append({
            'title': f'Reduce sprinkler runtime by 18% in shaded zones',
            'impact': 'high',
            'estimated_cost': '₹0 (config change)',
            'benefit': '~9% total water saved',
            'difficulty': 'easy',
            'order': order,
        })
        order += 1

    if assessment.pest_control_method in ('broad_spectrum', ''):
        recs.append({
            'title': 'Replace broad-spectrum pesticides with targeted biological control',
            'impact': 'high',
            'estimated_cost': '₹45,000',
            'benefit': 'Healthier soil & pollinators',
            'difficulty': 'medium',
            'order': order,
        })
        order += 1

    if 'Bees' not in assessment.species_observed or 'Butterflies' not in assessment.species_observed:
        recs.append({
            'title': 'Add bee-safe flowering buffer zones away from play areas',
            'impact': 'medium',
            'estimated_cost': '₹28,000',
            'benefit': 'Restored pollinator habitat',
            'difficulty': 'easy',
            'order': order,
        })
        order += 1

    if assessment.moisture_sensors == 'none':
        recs.append({
            'title': 'Introduce moisture sensors for fairway irrigation',
            'impact': 'high',
            'estimated_cost': '₹1,20,000',
            'benefit': '~19% irrigation efficiency',
            'difficulty': 'medium',
            'order': order,
        })
        order += 1

    if assessment.mowing_frequency > 4:
        recs.append({
            'title': 'Shift mowing schedules to protect ground-nesting species',
            'impact': 'medium',
            'estimated_cost': '₹0 (schedule change)',
            'benefit': 'Lower energy + nest safety',
            'difficulty': 'easy',
            'order': order,
        })
        order += 1

    if assessment.energy_source == 'petrol_diesel':
        recs.append({
            'title': 'Transition mowing fleet to electric or hybrid equipment',
            'impact': 'medium',
            'estimated_cost': '₹3,50,000',
            'benefit': '~20% energy cost reduction',
            'difficulty': 'hard',
            'order': order,
        })
        order += 1

    if not recs:
        recs.append({
            'title': 'Conduct a detailed soil health audit to identify further improvements',
            'impact': 'medium',
            'estimated_cost': '₹15,000',
            'benefit': 'Improved turf quality',
            'difficulty': 'easy',
            'order': 0,
        })

    return recs
