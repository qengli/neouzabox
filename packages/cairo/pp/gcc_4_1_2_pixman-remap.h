--- cairo-1.0.2/pixman/src/pixman-remap.h.orig	2007-08-09 11:32:45.000000000 +0800
+++ cairo-1.0.2/pixman/src/pixman-remap.h	2007-08-09 11:33:06.000000000 +0800
@@ -1,9 +1,9 @@
 #define pixman_add_trapezoids _cairo_pixman_add_trapezoids
-#define INT_pixman_color_to_pixel _cairo_pixman_color_to_pixel
+//#define INT_pixman_color_to_pixel _cairo_pixman_color_to_pixel
 #define pixman_color_to_pixel _cairo_pixman_color_to_pixel
 #define composeFunctions _cairo_pixman_compose_functions
 #define fbComposeSetupMMX _cairo_pixman_compose_setup_mmx
-#define INT_pixman_composite _cairo_pixman_composite
+//#define INT_pixman_composite _cairo_pixman_composite
 #define pixman_composite _cairo_pixman_composite
 #define fbCompositeCopyAreammx _cairo_pixman_composite_copy_area_mmx
 #define fbCompositeSolidMask_nx8888x0565Cmmx _cairo_pixman_composite_solid_mask_nx8888x0565Cmmx
