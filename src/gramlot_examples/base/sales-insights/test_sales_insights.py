"""Business metrics use explicit per-year totals and distinct customer counts."""
import unittest
from sales_insights import territory_measures

class TerritoryMeasuresTest(unittest.TestCase):
    def setUp(self):
        self.data={'state_year':[
            dict(year=2024,territory='A',revenue=100,customers=10),
            dict(year=2025,territory='A',revenue=80,customers=2),
            dict(year=2024,territory='B',revenue=200,customers=5),
            dict(year=2025,territory='B',revenue=300,customers=3)]}

    def test_ratios_use_current_year_distinct_customers_and_prior_year_total(self):
        result={r['territory']:r for r in territory_measures(self.data,2025)}
        self.assertEqual(result['A']['billed_per_customer'],40)
        self.assertEqual(result['A']['annual_change_pct'],-20)
        self.assertEqual(result['B']['billed_per_customer'],100)
        self.assertEqual(result['B']['annual_change_pct'],50)
        self.assertEqual(result['A']['customers'],2)

    def test_unavailable_denominators_are_not_invented(self):
        self.data['state_year'][0]['revenue']=0
        with self.assertRaises(ValueError):territory_measures(self.data,2025)
        self.data['state_year'][0]['revenue']=100
        self.data['state_year'][1]['customers']=0
        with self.assertRaises(ValueError):territory_measures(self.data,2025)
        with self.assertRaises(ValueError):territory_measures(self.data,2024)

if __name__=='__main__':unittest.main()
