Author: Eugen Berlin, Embedded Sensing Systems, Technische Universität Darmstadt

Data set website : http://www.ess.tu-darmstadt.de/datasets/ubicomp2012-motifs

Eugen Berlin and Kristof Van Laerhoven, "Detecting Leisure Activities with 
Dense Motif Discovery". In Proceedings of the 14th ACM International Conference 
on Ubiquitous Computing (UbiComp 2012), Pittsburgh, PA, USA. ACM Press. 2012.


IMPORTANT NOTE
--------------

This data set is opened up to anyone interested in activity recognition to 
encourage reproducible results. Please cite our paper if you publish results 
on this data set, and consider making your own data sets open for anyone to 
download in a similar fashion. We would also be very interested to hear back 
from you if you use our data in any way and are happy to answer any questions 
or address any remarks related to it. 


DATA SET CONTENTS
-----------------

This data set contains multiple days of raw sensor data, recorded by our wrist-
worn activity logger (HedgeHog), stored as numerical python data format (.npy).
For each subject, a leisure activity was selected, which was performed for 30
up to 90 minutes per day (24 hours).


LOADING DATA
------------

To load the data we need to import the numpy library and issue the load command:

>>> import numpy as np
>>> dta = np.load("file.npy").view(np.recarray)

The 'dta' variable now holds a record array with following columns:
  dta.t - time stamp in ordinal format
  dta.d - runlength encoding - delta values
  dta.x - accelerometer X-axis
  dta.y - accelerometer Y-axis
  dta.z - accelerometer Z-axis
  dta.l - ambient light sensor


PLOTTING DATA
-------------

For plotting, we use the matplotlib pyplot library in its interactive mode:

>>> import matplotlib.pyplot as plt
>>> plt.ion()

Now, to plot accelerometer sensor data against time, we can use the pyplot 
plot_date() function. It will automatically convert the ordinal date to a human 
readable date format:

>>> plt.plot_date(dta.t , dta.x)

Alternatively, we can plot all three accelerometer axes at once:

>>> plt.plot_date(dta.t , np.array((dta.x, dta.y, dta.z)).T , '-')

If we are not interested in the time and date, we can accumulate the RLE delta 
values and use these on the abscissa:

>>> plt.plot(np.cumsum(dta.d) , np.array((dta.x, dta.y, dta.z)).T )

