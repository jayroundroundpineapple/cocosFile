#!/usr/bin/python
# -*- coding: utf-8 -*- 
import xlrd
import os
import json

book = xlrd.open_workbook('Language.xls')

sheet = book.sheet_by_name("language")

nrows = sheet.nrows

dicts = {}
for i in range(nrows):
	if i > 0:
		data = sheet.row_values(i)

		language_amount = len(data) - 1
		text_id     	= '%d'%int(data[0])


		dicts[text_id] = {}
		row_data = {}
		for j in range(1, len(data)):
			# print '%s'%sheet.row_values(0)[j]
			row_data['%s'%sheet.row_values(0)[j]] = data[j]

		dicts[text_id] = row_data

stri = json.dumps(dicts)


f0 = open("../assets/resources/language.json", "w+")
f0.write(stri)
f0.flush()

print ('generate succ!')

