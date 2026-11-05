"""Deterministic provider cases for both supported Bag row modes."""
import unittest
from gramlot_examples.base.chart_report import FixtureChartReport

class ChartReportTest(unittest.TestCase):
    def test_row_modes_empty_and_schema(self):
        for mode in ('attributes','values'):
            p=FixtureChartReport(mode)
            record=p.read('2025').get_item('rows').nodes[0]
            values=record.value.as_dict() if mode=='values' else record.attr
            self.assertEqual(values['territory'],'Alpha')
            self.assertEqual(values['revenue'],500)
            self.assertEqual(p.read('2030').get_item('count'),0)
            changed=p.read('2023').get_item('rows').nodes[0]
            fields=changed.value.keys() if mode=='values' else changed.attr.keys()
            self.assertIn('units',fields);self.assertNotIn('per_customer',fields)
            with self.assertRaises(ValueError):p.read('2022')
